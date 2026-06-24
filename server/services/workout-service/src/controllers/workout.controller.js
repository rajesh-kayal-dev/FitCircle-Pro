import Workout from "../models/Workout.js";
import WorkoutPlan from "../models/WorkoutPlan.js";
import {
  getExercisesByBodyPart,
  getExerciseById,
  getExercisesByTarget,
  getExercisesByEquipment,
  listBodyParts,
  searchExercises,
} from "../services/exerciseDbService.js";
import { searchWorkoutVideos } from "../services/youtubeService.js";
import { generateWorkoutPlan } from "../services/workoutAiService.js";

// ---- Custom Workouts (existing) ----

export const createWorkout = async (req, res) => {
  try {
    const { title, exercises } = req.body;
    const workout = await Workout.create({
      userId: req.user.id,
      title,
      exercises,
    });
    res.status(201).json({ message: "Workout created ✅", workout });
  } catch (error) {
    res.status(500).json({ message: "Error creating workout ❌" });
  }
};

export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workouts ❌" });
  }
};

// ---- Exercise Explorer (Feature 1 & 2) ----

export const listExercises = async (req, res) => {
  try {
    const { bodyPart, target, equipment, name, limit } = req.query;

    let exercises;
    if (bodyPart) {
      exercises = await getExercisesByBodyPart(bodyPart);
    } else if (target) {
      exercises = await getExercisesByTarget(target);
    } else if (equipment) {
      exercises = await getExercisesByEquipment(equipment);
    } else if (name) {
      exercises = await searchExercises(name);
    } else {
      exercises = await getExercisesByBodyPart("full_body");
    }

    const result = Array.isArray(exercises) ? exercises : [];
    if (limit) result.splice(parseInt(limit));

    res.json({ success: true, exercises: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch exercises" });
  }
};

export const getExerciseDetail = async (req, res) => {
  try {
    const exercise = await getExerciseById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ success: false, message: "Exercise not found" });
    }
    res.json({ success: true, exercise });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch exercise" });
  }
};

export const getBodyParts = async (req, res) => {
  try {
    const parts = await listBodyParts();
    res.json({ success: true, bodyParts: parts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch body parts" });
  }
};

// ---- YouTube Workout Videos (Feature 3) ----

export const searchVideos = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
    }
    const videos = await searchWorkoutVideos(q);
    res.json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to search videos" });
  }
};

// ---- AI Workout Generator (Feature 4 & 5) ----

export const generatePlan = async (req, res) => {
  try {
    const { goal, age, height, weight, location, daysPerWeek, experience } = req.body;

    if (!goal || !age || !height || !weight || !location || !daysPerWeek || !experience) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const markdownPlan = await generateWorkoutPlan({
      goal, age, height, weight, location, daysPerWeek, experience,
    });

    res.json({ success: true, plan: markdownPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to generate plan" });
  }
};

// ---- Save & Manage Workout Plans (Feature 6, 7, 8) ----

export const savePlan = async (req, res) => {
  try {
    const { goal, daysPerWeek, experience, location, markdownPlan } = req.body;

    if (!goal || !daysPerWeek || !experience || !location || !markdownPlan) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const plan = await WorkoutPlan.create({
      userId: req.user.id,
      goal,
      daysPerWeek,
      experience,
      location,
      markdownPlan,
    });

    res.status(201).json({ success: true, message: "Plan saved ✅", plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to save plan" });
  }
};

export const getPlans = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch plans" });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ _id: req.params.id, userId: req.user.id });
    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch plan" });
  }
};

export const downloadPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ _id: req.params.id, userId: req.user.id });
    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }
    res.setHeader("Content-Type", "text/markdown");
    res.setHeader("Content-Disposition", `attachment; filename="workout-plan-${plan._id}.md"`);
    res.send(plan.markdownPlan);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to download plan" });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }
    res.json({ success: true, message: "Plan deleted ✅" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to delete plan" });
  }
};
