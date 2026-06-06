import express from "express";
import { addMeal, getMeals } from "../controllers/diet.controller.js";
import protect from "../middleware/auth.moddleware.js";

const router = express.Router();

router.post("/", protect, addMeal);
router.get("/", protect, getMeals);

export default router;