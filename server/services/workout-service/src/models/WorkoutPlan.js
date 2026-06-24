import mongoose from "mongoose";

const workoutPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    goal: {
      type: String,
      enum: ["muscle_gain", "weight_loss", "strength", "endurance"],
      required: true,
    },
    daysPerWeek: {
      type: Number,
      required: true,
    },
    experience: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    location: {
      type: String,
      enum: ["gym", "home"],
      required: true,
    },
    markdownPlan: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);

export default WorkoutPlan;
