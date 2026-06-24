import axios from "axios";

/**
 * Open Food Facts API Integration for Diet Service
 * Base URL: https://world.openfoodfacts.org
 */

const BASE_URL = "https://world.openfoodfacts.org/cgi/search.pl";
const API_URL = "https://world.openfoodfacts.org/api/v2";

/**
 * Search for food items using Open Food Facts
 */
export const searchFoods = async (query) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        search_terms: query,
        search_simple: 1,
        action: "process",
        json: 1,
        page_size: 20
      }
    });

    if (!response.data || !response.data.products) {
      return [];
    }

    return response.data.products.map(product => {
      const nutriments = product.nutriments || {};
      
      return {
        id: product.code || product.id || Math.random().toString(),
        name: product.product_name || "Unknown Food",
        brand: product.brands || "Generic",
        image: product.image_url || null,
        description: product.generic_name || "",
        calories: nutriments["energy-kcal_100g"] ? Math.round(nutriments["energy-kcal_100g"]) : 0,
        protein: nutriments.proteins_100g ? Math.round(nutriments.proteins_100g) : 0,
        carbs: nutriments.carbohydrates_100g ? Math.round(nutriments.carbohydrates_100g) : 0,
        fat: nutriments.fat_100g ? Math.round(nutriments.fat_100g) : 0,
        fiber: nutriments.fiber_100g ? Math.round(nutriments.fiber_100g) : 0,
        sugar: nutriments.sugars_100g ? Math.round(nutriments.sugars_100g) : 0,
        sodium: nutriments.sodium_100g ? Math.round(nutriments.sodium_100g * 1000) : 0, // convert to mg
        servingSize: "100g"
      };
    });
  } catch (error) {
    console.error("OpenFoodFacts search error:", error.message);
    throw new Error("Failed to search foods");
  }
};

/**
 * Get a specific food item by barcode
 */
export const getFoodById = async (barcode) => {
  try {
    const response = await axios.get(`${API_URL}/product/${barcode}`);
    
    if (response.data.status === 0) {
      throw new Error("Product not found");
    }

    const product = response.data.product;
    const nutriments = product.nutriments || {};

    return {
      id: product.code,
      name: product.product_name || "Unknown Food",
      brand: product.brands || "Generic",
      image: product.image_url || null,
      description: product.generic_name || "",
      calories: nutriments["energy-kcal_100g"] ? Math.round(nutriments["energy-kcal_100g"]) : 0,
      protein: nutriments.proteins_100g ? Math.round(nutriments.proteins_100g) : 0,
      carbs: nutriments.carbohydrates_100g ? Math.round(nutriments.carbohydrates_100g) : 0,
      fat: nutriments.fat_100g ? Math.round(nutriments.fat_100g) : 0,
      fiber: nutriments.fiber_100g ? Math.round(nutriments.fiber_100g) : 0,
      sugar: nutriments.sugars_100g ? Math.round(nutriments.sugars_100g) : 0,
      sodium: nutriments.sodium_100g ? Math.round(nutriments.sodium_100g * 1000) : 0, // convert to mg
      servingSize: "100g"
    };
  } catch (error) {
    console.error("OpenFoodFacts barcode lookup error:", error.message);
    throw new Error("Failed to get food details");
  }
};
