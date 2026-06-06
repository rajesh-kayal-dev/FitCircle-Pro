import Meal from "../models/Meal.js";

// add meal
export const addMeal = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat } = req.body;

    const meal = await Meal.create({
      userId: req.user.id,
      name,
      calories,
      protein,
      carbs,
      fat,
    });

    res.json({ message: "Meal added ✅", meal });
  } catch (error) {
    res.status(500).json({ message: "Error adding meal ❌" });
  }
};

// get meals
export const getMeals = async (req, res) => {
  try {
    const meals = await Meal.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meals ❌" });
  }
};