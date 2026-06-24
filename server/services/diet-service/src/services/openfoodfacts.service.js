import axios from "axios";

/**
 * Open Food Facts API Integration for Diet Service
 * Base URL: https://world.openfoodfacts.org
 *
 * Changes from v1:
 * - search_simple: 0  → enables full-text search (better for Indian dishes like "Paneer Tikka")
 * - page_size: 30     → more candidates for the reranker to choose from
 * - Filters out junk entries (no name, or 0 calories AND 0 protein)
 */

const BASE_URL = "https://world.openfoodfacts.org/cgi/search.pl";
const API_URL  = "https://world.openfoodfacts.org/api/v2";

function mapProduct(product) {
  const nutriments = product.nutriments || {};
  return {
    id:          product.code || product.id || Math.random().toString(36).slice(2),
    name:        product.product_name || product.generic_name || "Unknown Food",
    brand:       product.brands || "Generic",
    image:       product.image_url || null,
    description: product.generic_name || "",
    calories:    nutriments["energy-kcal_100g"]   ? Math.round(nutriments["energy-kcal_100g"])   : 0,
    protein:     nutriments.proteins_100g         ? Math.round(nutriments.proteins_100g)         : 0,
    carbs:       nutriments.carbohydrates_100g    ? Math.round(nutriments.carbohydrates_100g)    : 0,
    fat:         nutriments.fat_100g              ? Math.round(nutriments.fat_100g)              : 0,
    fiber:       nutriments.fiber_100g            ? Math.round(nutriments.fiber_100g)            : 0,
    sugar:       nutriments.sugars_100g           ? Math.round(nutriments.sugars_100g)           : 0,
    sodium:      nutriments.sodium_100g           ? Math.round(nutriments.sodium_100g * 1000)    : 0, // → mg
    servingSize: "100g",
  };
}

/**
 * Search for food items using Open Food Facts full-text search.
 * Returns up to 30 candidates for scoring/reranking.
 */
export const searchFoods = async (query) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        search_terms:  query,
        search_simple: 0,       // full-text search — better for multi-word Indian dish names
        action:        "process",
        json:          1,
        page_size:     30,      // more candidates → better reranking coverage
        fields:        "code,product_name,generic_name,brands,image_url,nutriments",
      },
      timeout: 8000,
    });

    if (!response.data?.products?.length) return [];

    return response.data.products
      .map(mapProduct)
      // Filter junk: must have a name and at least some nutritional data
      .filter(p => p.name && p.name !== "Unknown Food" && (p.calories > 0 || p.protein > 0));

  } catch (error) {
    console.error("OpenFoodFacts search error:", error.message);
    return []; // graceful fallback — don't throw, let caller handle empty
  }
};

/**
 * Get a specific food item by barcode.
 */
export const getFoodById = async (barcode) => {
  try {
    const response = await axios.get(`${API_URL}/product/${barcode}`);

    if (response.data.status === 0) {
      throw new Error("Product not found");
    }

    return mapProduct(response.data.product);
  } catch (error) {
    console.error("OpenFoodFacts barcode lookup error:", error.message);
    throw new Error("Failed to get food details");
  }
};
