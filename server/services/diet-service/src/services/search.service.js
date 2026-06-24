import NodeCache from "node-cache";
import commonFoods from "../data/common-foods.js";
import { searchFoods as searchOpenFoodFacts } from "./openfoodfacts.service.js";
import { searchNutritionWeb } from "./tavily.service.js";
import { generateQuickInsight, generateNutritionSummary, autoCorrectQuery } from "./groq.service.js";

const foodCache = new NodeCache({ stdTTL: 86400 });

function normalize(str) {
  return str.toLowerCase().trim().replace(/\s+/g, " ");
}

function removeStopWords(query) {
  return query.replace(/\b(a|an|the|for|and|or|is|of|with|in|on|to|i|my|me|want|need|find|search|looking|please|show|give|get)\b/gi, "").trim();
}

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
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

function searchCommonFoods(query) {
  const normalized = normalize(query);
  const cleaned = normalize(removeStopWords(query));
  const queryWords = cleaned.split(/\s+/).filter(Boolean);

  if (queryWords.length === 0) return null;

  let bestMatch = null;
  let bestScore = -1;

  for (const food of commonFoods) {
    const allNames = [normalize(food.name), ...food.aliases.map(a => normalize(a))];

    for (const name of allNames) {
      let score = 0;

      if (name === normalized) {
        score = 100;
      } else if (name === cleaned) {
        score = 95;
      } else if (name.includes(normalized) || normalized.includes(name)) {
        score = 80;
      } else if (normalized.length > 2 && levenshtein(normalized, name) <= Math.max(1, Math.floor(normalized.length / 3))) {
        score = 75;
      } else if (normalized.length > 2 && levenshtein(cleaned, name) <= Math.max(1, Math.floor(cleaned.length / 3))) {
        score = 70;
      } else if (queryWords.length > 0) {
        const nameWords = name.split(/\s+/);
        const matches = queryWords.filter(qw => nameWords.some(nw => nw.includes(qw) || qw.includes(nw)));
        if (matches.length === queryWords.length) {
          score = 60 + (matches.length / queryWords.length) * 10;
        } else if (matches.length > 0) {
          score = (matches.length / queryWords.length) * 40;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = food;
      }
    }
  }

  return bestScore >= 40 ? { ...bestMatch, isBestMatch: true } : null;
}

function getCorrection(match, originalQuery) {
  if (!match) return null;
  const normalizedOriginal = normalize(originalQuery);
  const normalizedName = normalize(match.name);
  if (levenshtein(normalizedOriginal, normalizedName) > Math.floor(normalizedName.length / 3) && !normalizedName.includes(normalizedOriginal)) {
    return match.name;
  }
  return null;
}

export const searchDietTracker = async (query) => {
  const cacheKey = `search_${query.toLowerCase().trim()}`;

  const cachedData = foodCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const correctedQuery = null;
    let bestMatch = searchCommonFoods(query);

    let correctedQueryDisplay = getCorrection(bestMatch, query);

    // Determine match type for UI: exact (dish), phrase, or ingredient
    let matchType = null;
    if (bestMatch) {
      const normalizedQuery = normalize(query);
      const allNames = [normalize(bestMatch.name), ...(bestMatch.aliases || []).map(a => normalize(a))];
      if (allNames.includes(normalizedQuery)) {
        matchType = "exact";
      } else if (normalize(bestMatch.name).includes(normalizedQuery) || normalizedQuery.includes(normalize(bestMatch.name))) {
        matchType = "phrase";
      } else {
        matchType = "ingredient";
      }
    }

    // Always query OpenFoodFacts for the original query (do not skip based on bestMatch)
    const [insight, offFoods] = await Promise.all([
      generateQuickInsight(correctedQueryDisplay || query),
      searchOpenFoodFacts(query)
    ]);

    let foods = [];
    if (offFoods && offFoods.length > 0) {
      const normalizedQuery = normalize(query);

      // Prefer exact / phrase matches to the full query (e.g., "paneer tikka")
      const exactFoods = offFoods.filter(f => {
        const fName = normalize(f.name || "");
        return fName === normalizedQuery || fName.includes(normalizedQuery) || normalizedQuery.includes(fName);
      });

      foods = exactFoods.length > 0 ? exactFoods : offFoods;
    }

    if (foods.length === 0) {
      const webResult = await searchNutritionWeb(query);
      if (webResult) {
        foods = [webResult];
      }
    }

    const finalData = {
      insight,
      bestMatch,
      matchType,
      correctedQuery: correctedQueryDisplay,
      foods
    };

    foodCache.set(cacheKey, finalData);
    return finalData;

  } catch (error) {
    console.error("Search Service Error:", error);
    const bestMatch = searchCommonFoods(query);
    return {
      insight: "",
      bestMatch,
      correctedQuery: null,
      foods: []
    };
  }
};

export const analyzeFoodResult = async (foodData) => {
  const cacheKey = `analyze_${foodData.id || foodData.name}`;

  const cachedData = foodCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const jsonString = await generateNutritionSummary(foodData);
    const analysis = JSON.parse(jsonString);
    foodCache.set(cacheKey, analysis);
    return analysis;
  } catch (error) {
    console.error("Food Analysis Error:", error);
    return {
      summary: "Detailed summary currently unavailable.",
      benefits: ["General nutrition"],
      bestFor: ["General Health"]
    };
  }
};
