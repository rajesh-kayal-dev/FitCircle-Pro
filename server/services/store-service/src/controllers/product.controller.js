import { searchProductsOFF as searchFoods, getProductByBarcode as getFoodById } from "../services/openfoodfacts.service.js";

/**
 * GET /api/products/search?q=...
 */
export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
    }

    const result = await searchFoods(query);
    res.json({ success: true, foods: result });
  } catch (error) {
    console.error("OpenFoodFacts search error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to search products",
      stack: error.stack
    });
  }
};

/**
 * GET /api/products/:id
 */
export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await getFoodById(id);
    
    if (!food) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, food });
  } catch (error) {
    console.error("OpenFoodFacts detail error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get product details",
    });
  }
};
