import express from "express";
import {
  addMeal,
  getMeals,
  calculateTargets,
  createDietPlan,
  getDietPlanHistory,
  getDietPlanById,
  searchFood,
  analyzeFood,
  logFood,
  getTodayFoodLog,
  askAI,
  autoCorrectFoodQuery,
} from "../controllers/diet.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Existing meal routes
router.post("/meals", protect, addMeal);
router.get("/meals", protect, getMeals);

// Calculate nutrition targets
router.post("/calculate", protect, calculateTargets);

// AI diet plan
router.post("/plan", protect, createDietPlan);
router.get("/plans", protect, getDietPlanHistory);
router.get("/plans/:id", protect, getDietPlanById);

// Nutrition food search & analysis
router.get("/foods/search", protect, searchFood);
router.post("/foods/analyze", protect, analyzeFood);

// Daily food log
router.post("/food/log", protect, logFood);
router.get("/food/today", protect, getTodayFoodLog);

// Auto-correct food query
router.post("/foods/autocorrect", protect, autoCorrectFoodQuery);

// Nutrition AI chat
router.post("/ask", protect, askAI);

export default router;
