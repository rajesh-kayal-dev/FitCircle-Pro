import Meal from "../models/Meal.js";
import DietPlan from "../models/DietPlan.js";
import FoodLog from "../models/FoodLog.js";
import { calculateBMI } from "../utils/bmi.js";
import { calculateBMR } from "../utils/bmr.js";
import { calculateTDEE } from "../utils/tdee.js";
import { calculateMacros } from "../utils/macros.js";
import { generateDietPlan, askNutritionAI, autoCorrectQuery } from "../services/groq.service.js";
import { searchDietTracker, analyzeFoodResult } from "../services/search.service.js";

// ── Existing Meal endpoints ────────────────────────────────────────────
export const addMeal = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat } = req.body;
    const meal = await Meal.create({ userId: req.user.id, name, calories, protein, carbs, fat });
    res.json({ message: "Meal added ✅", meal });
  } catch (error) {
    res.status(500).json({ message: "Error adding meal ❌" });
  }
};

export const getMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meals ❌" });
  }
};

// ── Calculate nutrition targets ────────────────────────────────────────
export const calculateTargets = async (req, res) => {
  try {
    const { age, gender, height, weight, targetWeight, activityLevel, goal, dietType, allergies, budget, mealsPerDay } = req.body;

    const bmi = Math.round(calculateBMI(weight, height) * 10) / 10;
    const bmr = Math.round(calculateBMR(weight, height, age, gender));
    const tdee = calculateTDEE(bmr, activityLevel);
    const macros = calculateMacros(tdee, goal, weight);

    res.json({ bmi, bmr, tdee, ...macros });
  } catch (error) {
    res.status(500).json({ message: "Calculation error ❌", error: error.message });
  }
};

// ── Generate AI diet plan ──────────────────────────────────────────────
export const createDietPlan = async (req, res) => {
  try {
    const { age, gender, height, weight, targetWeight, activityLevel, goal, dietType, allergies, budget, mealsPerDay } = req.body;

    const bmi = Math.round(calculateBMI(weight, height) * 10) / 10;
    const bmr = Math.round(calculateBMR(weight, height, age, gender));
    const tdee = calculateTDEE(bmr, activityLevel);
    const macros = calculateMacros(tdee, goal, weight);

    const jsonResponseString = await generateDietPlan({
      goal,
      calories: macros.calories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
      dietType: dietType || "non_veg",
      budget: budget || "medium",
      mealsPerDay: mealsPerDay || 4,
    });

    let planData = {};
    let markdownPlan = "";
    
    try {
      planData = JSON.parse(jsonResponseString);
      markdownPlan = planData.markdownExport || "";
    } catch (err) {
      console.error("Failed to parse AI JSON response:", err);
      // Fallback
      markdownPlan = jsonResponseString;
    }

    const plan = await DietPlan.create({
      userId: req.user.id,
      goal,
      age,
      gender,
      height,
      weight,
      activityLevel,
      dietType,
      allergies,
      budget,
      mealsPerDay,
      bmi,
      bmr,
      tdee,
      ...macros,
      markdownPlan,
      planData,
    });

    res.json({ success: true, plan });
  } catch (error) {
    console.error("Diet plan error:", error);
    res.status(500).json({ message: "Failed to generate plan ❌", error: error.message });
  }
};

// ── Get diet plan history ─────────────────────────────────────────────
export const getDietPlanHistory = async (req, res) => {
  try {
    const plans = await DietPlan.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plans ❌" });
  }
};

// ── Get single diet plan ──────────────────────────────────────────────
export const getDietPlanById = async (req, res) => {
  try {
    const plan = await DietPlan.findOne({ _id: req.params.id, userId: req.user.id });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plan ❌" });
  }
};

// ── Search foods via Search Service ─────────────────────────────────────────
export const searchFood = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Query required" });

    const result = await searchDietTracker(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Food search error ❌", error: error.message });
  }
};

// ── Analyze specific food via AI ──────────────────────────────────────────
export const analyzeFood = async (req, res) => {
  try {
    const foodData = req.body;
    if (!foodData) return res.status(400).json({ message: "Food data required" });

    const analysis = await analyzeFoodResult(foodData);
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ message: "Food analysis error ❌", error: error.message });
  }
};

// ── Log food to daily diary ───────────────────────────────────────────
export const logFood = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat, servingSize } = req.body;
    const log = await FoodLog.create({
      userId: req.user.id,
      name,
      calories,
      protein,
      carbs,
      fat,
      servingSize,
    });
    res.json({ message: "Food logged ✅", log });
  } catch (error) {
    res.status(500).json({ message: "Error logging food ❌" });
  }
};

// ── Get today's food log ──────────────────────────────────────────────
export const getTodayFoodLog = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const logs = await FoodLog.find({ userId: req.user.id, date: today }).sort({ createdAt: -1 });

    const totals = logs.reduce(
      (acc, l) => ({
        calories: acc.calories + (l.calories || 0),
        protein: acc.protein + (l.protein || 0),
        carbs: acc.carbs + (l.carbs || 0),
        fat: acc.fat + (l.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    res.json({ logs, totals });
  } catch (error) {
    res.status(500).json({ message: "Error fetching food log ❌" });
  }
};

// ── Auto-correct food query ──────────────────────────────────────────
export const autoCorrectFoodQuery = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: "Query required" });
    const corrected = await autoCorrectQuery(query);
    res.json({ original: query, corrected, changed: corrected !== query });
  } catch (error) {
    res.status(500).json({ message: "Auto-correct error", error: error.message });
  }
};

// ── Ask Nutrition AI ──────────────────────────────────────────────────
export const askAI = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: "Question required" });

    const answer = await askNutritionAI(question);
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ message: "AI error ❌", error: error.message });
  }
};
