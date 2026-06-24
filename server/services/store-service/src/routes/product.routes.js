import express from "express";
import { searchProducts, getProductDetails } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/search", searchProducts);
router.get("/:id", getProductDetails);

export default router;
