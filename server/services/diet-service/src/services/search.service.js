import NodeCache from "node-cache";
import commonFoods from "../data/common-foods.js";
import { searchFoods as searchOpenFoodFacts } from "./openfoodfacts.service.js";
import { searchNutritionWeb } from "./tavily.service.js";
import { generateQuickInsight, generateNutritionSummary, rerankFoodResults } from "./groq.service.js";

const foodCache = new NodeCache({ stdTTL: 86400 });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalize(str) {
  return str.toLowerCase().trim().replace(/\s+/g, " ");
}

function removeStopWords(query) {
  return query
    .replace(/\b(a|an|the|for|and|or|is|of|with|in|on|to|i|my|me|want|need|find|search|looking|please|show|give|get)\b/gi, "")
    .trim();
}

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// ─── Common-foods local scoring ────────────────────────────────────────────────

function searchCommonFoods(query) {
  const normalized = normalize(query);
  const cleaned    = normalize(removeStopWords(query));
  const queryWords = cleaned.split(/\s+/).filter(Boolean);
  if (queryWords.length === 0) return null;

  let bestMatch = null;
  let bestScore = -1;

  for (const food of commonFoods) {
    const allNames = [normalize(food.name), ...food.aliases.map(a => normalize(a))];
    for (const name of allNames) {
      let score = 0;
      if (name === normalized)                                                                   score = 100;
      else if (name === cleaned)                                                                 score = 95;
      else if (name.includes(normalized) || normalized.includes(name))                         score = 80;
      else if (normalized.length > 2 && levenshtein(normalized, name) <= Math.max(1, Math.floor(normalized.length / 3))) score = 75;
      else if (normalized.length > 2 && levenshtein(cleaned, name) <= Math.max(1, Math.floor(cleaned.length / 3)))       score = 70;
      else if (queryWords.length > 0) {
        const nameWords = name.split(/\s+/);
        const matches   = queryWords.filter(qw => nameWords.some(nw => nw.includes(qw) || qw.includes(nw)));
        if (matches.length === queryWords.length)  score = 60 + (matches.length / queryWords.length) * 10;
        else if (matches.length > 0)               score = (matches.length / queryWords.length) * 40;
      }
      if (score > bestScore) { bestScore = score; bestMatch = food; }
    }
  }

  return bestScore >= 40 ? { ...bestMatch, isBestMatch: true } : null;
}

function getCorrection(match, originalQuery) {
  if (!match) return null;
  const normOrig = normalize(originalQuery);
  const normName = normalize(match.name);
  if (levenshtein(normOrig, normName) > Math.floor(normName.length / 3) && !normName.includes(normOrig)) {
    return match.name;
  }
  return null;
}

// ─── OFf relevance scoring (per result) ───────────────────────────────────────

/**
 * Score a single OpenFoodFacts result against the query.
 * Returns 0–100.
 */
function scoreFood(food, query) {
  const q    = normalize(query);
  const name = normalize(food.name || "");
  if (!name) return 0;

  if (name === q)                                              return 100;
  if (name.startsWith(q) || q.startsWith(name))               return 88;
  if (name.includes(q))                                        return 82;
  if (q.includes(name) && name.length > 4)                    return 75;

  // All query words present in result name
  const qWords = q.split(/\s+/).filter(Boolean);
  const nWords = name.split(/\s+/);
  const matches = qWords.filter(qw => nWords.some(nw => nw === qw || nw.startsWith(qw)));
  if (matches.length === qWords.length)                        return 65 + matches.length * 3;
  if (matches.length > 0)                                      return (matches.length / qWords.length) * 45;

  // Fuzzy fallback
  const dist = levenshtein(q, name);
  if (dist <= 2)                                               return 40;
  if (dist <= 4)                                               return 25;
  return 0;
}

// ─── Main search entry point ───────────────────────────────────────────────────

export const searchDietTracker = async (query) => {
  const cacheKey = `search_v2_${normalize(query)}`;
  const cached   = foodCache.get(cacheKey);
  if (cached) return cached;

  try {
    // 1. Run local common-foods match + OpenFoodFacts + AI insight in parallel
    const localBestMatch = searchCommonFoods(query);
    const correctedQuery = getCorrection(localBestMatch, query);

    const [insight, offResults] = await Promise.all([
      generateQuickInsight(correctedQuery || query),
      searchOpenFoodFacts(query),
    ]);

    // 2. Score every OFf result
    const scored = offResults
      .map(food => ({ food, score: scoreFood(food, query) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);

    const topScore = scored[0]?.score ?? 0;

    // 3. Determine match type for UI label
    let bestMatchFood   = null;
    let relatedFoods    = [];
    let matchType       = null;
    let usedGroqRerank  = false;

    if (topScore >= 60) {
      // OFf is confident — take top result as bestMatch, rest as related
      bestMatchFood = scored[0].food;
      relatedFoods  = scored.slice(1, 5).map(({ food }) => food);

      const q = normalize(query);
      const n = normalize(bestMatchFood.name);
      if (n === q)              matchType = "exact";
      else if (n.includes(q))   matchType = "phrase";
      else                      matchType = "ingredient";

    } else if (scored.length > 0) {
      // OFf has results but low confidence → ask Groq to rerank
      usedGroqRerank = true;
      const foodNames = scored.map(({ food }) => food.name);
      const { bestMatch: bestName, related: relatedNames } = await rerankFoodResults(query, foodNames);

      if (bestName) {
        bestMatchFood = scored.find(({ food }) => food.name === bestName)?.food || scored[0].food;
        matchType     = "phrase";
        relatedFoods  = relatedNames
          .map(name => scored.find(({ food }) => food.name === name)?.food)
          .filter(Boolean);
      } else {
        // Groq also unsure — fall back to top 5 raw results as "related"
        relatedFoods = scored.slice(0, 5).map(({ food }) => food);
      }
    }

    // 4. If nothing from OFf, try Tavily web search as last resort
    if (!bestMatchFood && relatedFoods.length === 0) {
      const webResult = await searchNutritionWeb(query);
      if (webResult) relatedFoods = [webResult];
    }

    // 5. Prefer local commonFoods bestMatch if OFf best is low-confidence
    const finalBestMatch =
      (localBestMatch && (!bestMatchFood || topScore < 60))
        ? { ...localBestMatch, isBestMatch: true }
        : bestMatchFood
          ? { ...bestMatchFood, isBestMatch: true }
          : null;

    const finalData = {
      insight,
      bestMatch:      finalBestMatch,
      matchType,
      correctedQuery,
      foods:          relatedFoods,
      usedGroqRerank, // useful for debugging
    };

    foodCache.set(cacheKey, finalData);
    return finalData;

  } catch (error) {
    console.error("Search Service Error:", error);
    const localBestMatch = searchCommonFoods(query);
    return {
      insight:        "",
      bestMatch:      localBestMatch,
      matchType:      null,
      correctedQuery: null,
      foods:          [],
    };
  }
};

// ─── Food detail analysis ──────────────────────────────────────────────────────

export const analyzeFoodResult = async (foodData) => {
  const cacheKey = `analyze_${foodData.id || foodData.name}`;
  const cached   = foodCache.get(cacheKey);
  if (cached) return cached;

  try {
    const jsonString = await generateNutritionSummary(foodData);
    const analysis   = JSON.parse(jsonString);
    foodCache.set(cacheKey, analysis);
    return analysis;
  } catch (error) {
    console.error("Food Analysis Error:", error);
    return {
      summary:  "Detailed summary currently unavailable.",
      benefits: ["General nutrition"],
      bestFor:  ["General Health"],
    };
  }
};
