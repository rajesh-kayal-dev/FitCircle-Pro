import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Meal", mealSchema);