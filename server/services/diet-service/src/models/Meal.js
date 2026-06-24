import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    userId: String,
    name: { type: String, required: true },
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Meal", mealSchema);