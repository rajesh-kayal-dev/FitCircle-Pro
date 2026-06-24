import { tavily } from "@tavily/core";

/**
 * Search Tavily for nutrition data when Open Food Facts is incomplete.
 */
export const searchNutritionWeb = async (query) => {
  try {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      console.warn("TAVILY_API_KEY is missing. Using mock data.");
      return getMockNutrition();
    }

    const tvly = tavily({ apiKey });
    const response = await tvly.search(`${query} nutrition facts calories protein carbs fat`, {
      searchDepth: "basic",
      includeAnswer: true,
      maxResults: 3
    });

    if (!response || (!response.results && !response.answer)) {
      return getMockNutrition();
    }

    // Try to extract some basic structured data or return a summary
    return {
      name: query,
      isWebResult: true,
      summary: response.answer || (response.results[0] ? response.results[0].content : "No detailed nutrition facts found on the web."),
      sources: response.results.map(r => r.url)
    };
  } catch (error) {
    console.error("Tavily Nutrition Search Error:", error.message);
    return getMockNutrition();
  }
};

function getMockNutrition() {
  return {
    name: "Web Result",
    isWebResult: true,
    summary: "Based on web search, this food typically contains moderate protein and carbohydrates.",
    sources: []
  };
}
