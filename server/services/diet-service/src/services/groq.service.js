import Groq from "groq-sdk";

let groq = null;
function getGroq() {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
}

export async function generateDietPlan({ goal, calories, protein, carbs, fat, dietType, budget, mealsPerDay }) {
  const response = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a certified nutrition coach. Create a realistic Indian meal plan.
You MUST respond in valid JSON format. Do NOT wrap in markdown code blocks.

Requirements:
- Use exactly ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fat}g fat
- Diet type: ${dietType}
- Budget: ${budget || "medium"}
- Meals per day: ${mealsPerDay || 4}
- Use affordable foods and common Indian meals
- Include portion sizes
- Keep explanations short

The JSON object must have this exact structure:
{
  "explanation": "A short, 2-3 sentence explanation of why this plan works for the user's goal.",
  "hydration": "3.5 Litres / Day",
  "meals": [
    {
      "name": "Breakfast",
      "icon": "🍳",
      "calories": 400,
      "protein": 25,
      "carbs": 45,
      "fat": 15,
      "ingredients": [
        "3 Whole Eggs",
        "1 slice Whole Wheat Toast"
      ]
    }
  ],
  "shoppingList": [
    "Eggs",
    "Whole Wheat Bread"
  ],
  "markdownExport": "# Meal Plan\\n\\n## Daily Targets... (A complete, clean markdown version of the plan for exporting)"
}

Ensure the number of objects in the "meals" array matches ${mealsPerDay || 4}. Calculate the calories, protein, carbs, and fat for each meal accurately so they sum up to the daily targets.`,
      },
      {
        role: "user",
        content: `Create a ${goal} meal plan for ${dietType} diet with ${calories} calories, ${protein}g protein, ${carbs}g carbs, ${fat}g fat. Return JSON only.`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content || "{}";
}

export async function askNutritionAI(question) {
  const response = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a certified nutrition coach. Answer briefly in under 100 words. Be practical and science-based.",
      },
      {
        role: "user",
        content: question,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return response.choices[0]?.message?.content || "";
}

export async function generateNutritionSummary(foodData) {
  const response = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a nutrition expert. Analyze the provided food data and return a JSON object with:
- "summary": A 1-2 sentence simple explanation of the food.
- "benefits": An array of 3 short string benefits.
- "bestFor": An array of 1-3 strings representing fitness goals this is good for (e.g., "Muscle Gain", "Weight Loss", "General Health").
Respond with JSON only.`,
      },
      {
        role: "user",
        content: JSON.stringify(foodData),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 300,
  });

  return response.choices[0]?.message?.content || "{}";
}

export async function generateQuickInsight(query) {
  try {
    const response = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a witty, knowledgeable fitness coach. Provide a quick 1-sentence (max 25 words) nutrition insight about the queried food. Be specific about macros, benefits, or best time to eat it.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });
    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Quick insight error:", error.message);
    return "";
  }
}

export async function autoCorrectQuery(query) {
  try {
    const response = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a food spelling corrector. Fix misspelled food names. Only return the corrected food name, nothing else. If the query is already correct, return it as-is. Examples: 'chiken breast' -> 'chicken breast', 'banana' -> 'banana', 'omellete' -> 'omelette', 'paneer' -> 'paneer', 'brocoli' -> 'broccoli', 'oatmeel' -> 'oatmeal', 'avacado' -> 'avocado', 'salmon' -> 'salmon', 'soya chuncks' -> 'soy chunks'.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 0.1,
      max_tokens: 30,
    });
    return response.choices[0]?.message?.content?.trim() || query;
  } catch (error) {
    console.error("Auto-correct error:", error.message);
    return query;
  }
}

export async function generateHumanExplanation(foodData) {
  try {
    const response = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a friendly nutrition coach. Given a food item and its macros, write a short 2-3 sentence human explanation. Focus on why this food is good for fitness, muscle building, or fat loss. Be encouraging and practical. No markdown, just plain text.",
        },
        {
          role: "user",
          content: JSON.stringify(foodData),
        },
      ],
      temperature: 0.5,
      max_tokens: 150,
    });
    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Human explanation error:", error.message);
    return "";
  }
}

/**
 * Rerank food results by relevance to a query using Groq LLM.
 * Used when OpenFoodFacts confidence score is low (< 60).
 *
 * @param {string} query - Original user search query (e.g. "Paneer Tikka")
 * @param {string[]} foodNames - Array of candidate food names from OpenFoodFacts
 * @returns {{ bestMatch: string|null, related: string[] }}
 */
export async function rerankFoodResults(query, foodNames) {
  if (!foodNames || foodNames.length === 0) {
    return { bestMatch: null, related: [] };
  }

  try {
    const response = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a food search relevance expert. Given a user's search query and a list of food names from a database, rank them by relevance.

Return a JSON object with:
- "bestMatch": the single most relevant food name from the list (or null if none are relevant)
- "related": array of up to 4 other relevant food names from the list, ordered by relevance

Only use names from the provided list. If none are relevant to the query, return null for bestMatch and empty array for related.
Respond with JSON only.`,
        },
        {
          role: "user",
          content: JSON.stringify({ query, candidates: foodNames }),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 200,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    return {
      bestMatch: result.bestMatch || null,
      related:   Array.isArray(result.related) ? result.related.slice(0, 4) : [],
    };
  } catch (error) {
    console.error("Groq rerank error:", error.message);
    return { bestMatch: null, related: [] };
  }
}

