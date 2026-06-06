import express from "express";
import { addToCart, getCart, placeOrder } from "../controllers/store.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/cart", protect, addToCart);
router.get("/cart", protect, getCart);
router.post("/order", protect, placeOrder);

export default router;