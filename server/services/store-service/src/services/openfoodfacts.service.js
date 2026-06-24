import axios from "axios";

/**
 * Open Food Facts API Integration
 * Base URL: https://world.openfoodfacts.org
 */

const BASE_URL = "https://world.openfoodfacts.org/cgi/search.pl";
const API_URL = "https://world.openfoodfacts.org/api/v2";

/**
 * Search for products using Open Food Facts
 */
export const searchProductsOFF = async (query) => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        "User-Agent": "FitCirclePro - Web - Version 1.0"
      },
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

    // Map Open Food Facts data to our expected Store Product schema
    return response.data.products.map(product => {
      const nutriments = product.nutriments || {};
      
      return {
        id: product.code || product.id || Math.random().toString(),
        name: product.product_name || "Unknown Product",
        brand: product.brands || "Unknown Brand",
        image: product.image_url || null,
        description: product.generic_name || "No description available.",
        nutrition: {
          calories: nutriments["energy-kcal_100g"] ? Math.round(nutriments["energy-kcal_100g"]) : 0,
          protein: nutriments.proteins_100g ? Math.round(nutriments.proteins_100g) : 0,
          carbs: nutriments.carbohydrates_100g ? Math.round(nutriments.carbohydrates_100g) : 0,
          fat: nutriments.fat_100g ? Math.round(nutriments.fat_100g) : 0,
        },
        tags: product.categories_tags ? product.categories_tags.map(t => t.replace("en:", "")) : []
      };
    });
  } catch (error) {
    console.warn("OpenFoodFacts search error:", error.response?.status, error.message);
    
    // Fallback to dummy data if Open Food Facts is down or rate limiting
    return [
      {
        id: "dummy-1",
        name: "Premium Whey Protein",
        brand: "FitCircle Nutrition",
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=300",
        description: "High quality whey protein isolate.",
        nutrition: { calories: 120, protein: 24, carbs: 3, fat: 1 },
        tags: ["protein", "supplements"]
      },
      {
        id: "dummy-2",
        name: "Creatine Monohydrate",
        brand: "FitCircle Nutrition",
        image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&q=80&w=300",
        description: "Pure micronized creatine monohydrate.",
        nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        tags: ["creatine", "supplements"]
      },
      {
        id: "dummy-3",
        name: "Pre-Workout Energy",
        brand: "FitCircle Nutrition",
        image: "https://images.unsplash.com/photo-1622484211148-5226999a0718?auto=format&fit=crop&q=80&w=300",
        description: "Explosive energy and focus.",
        nutrition: { calories: 10, protein: 0, carbs: 2, fat: 0 },
        tags: ["pre-workout", "supplements", "energy"]
      }
    ];
  }
};

/**
 * Get a specific product by barcode
 */
export const getProductByBarcode = async (barcode) => {
  if (barcode.startsWith("dummy-")) {
    const dummyProducts = {
      "dummy-1": {
        id: "dummy-1", name: "Premium Whey Protein", brand: "FitCircle Nutrition",
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=300",
        description: "High quality whey protein isolate.",
        nutrition: { calories: 120, protein: 24, carbs: 3, fat: 1 }
      },
      "dummy-2": {
        id: "dummy-2", name: "Creatine Monohydrate", brand: "FitCircle Nutrition",
        image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&q=80&w=300",
        description: "Pure micronized creatine monohydrate.",
        nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 }
      },
      "dummy-3": {
        id: "dummy-3", name: "Pre-Workout Energy", brand: "FitCircle Nutrition",
        image: "https://images.unsplash.com/photo-1622484211148-5226999a0718?auto=format&fit=crop&q=80&w=300",
        description: "Explosive energy and focus.",
        nutrition: { calories: 10, protein: 0, carbs: 2, fat: 0 }
      }
    };
    return dummyProducts[barcode];
  }

  try {
    const response = await axios.get(`${API_URL}/product/${barcode}`, {
      headers: {
        "User-Agent": "FitCirclePro - Web - Version 1.0"
      }
    });
    
    if (response.data.status === 0) {
      throw new Error("Product not found");
    }

    const product = response.data.product;
    const nutriments = product.nutriments || {};

    return {
      id: product.code,
      name: product.product_name || "Unknown Product",
      brand: product.brands || "Unknown Brand",
      image: product.image_url || null,
      description: product.generic_name || "No description available.",
      nutrition: {
        calories: nutriments["energy-kcal_100g"] ? Math.round(nutriments["energy-kcal_100g"]) : 0,
        protein: nutriments.proteins_100g ? Math.round(nutriments.proteins_100g) : 0,
        carbs: nutriments.carbohydrates_100g ? Math.round(nutriments.carbohydrates_100g) : 0,
        fat: nutriments.fat_100g ? Math.round(nutriments.fat_100g) : 0,
      }
    };
  } catch (error) {
    console.error("OpenFoodFacts barcode lookup error:", error.message);
    throw new Error("Failed to get product details");
  }
};
