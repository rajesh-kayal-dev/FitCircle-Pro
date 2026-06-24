import mongoose from "mongoose";

const dietPlanSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    goal: String,
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    activityLevel: String,
    dietType: String,
    allergies: String,
    budget: String,
    mealsPerDay: Number,
    bmi: Number,
    bmr: Number,
    tdee: Number,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    markdownPlan: String,
    planData: Object,
  },
  { timestamps: true }
);

export default mongoose.model("DietPlan", dietPlanSchema);
