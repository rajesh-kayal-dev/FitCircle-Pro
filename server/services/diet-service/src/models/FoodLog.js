import mongoose from "mongoose";

const foodLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    servingSize: String,
    date: { type: String, default: () => new Date().toISOString().split("T")[0] },
  },
  { timestamps: true }
);

foodLogSchema.index({ userId: 1, date: -1 });

export default mongoose.model("FoodLog", foodLogSchema);
