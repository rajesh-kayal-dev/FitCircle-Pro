import express from "express";
import {
  createWorkout,
  getWorkouts,
  listExercises,
  getExerciseDetail,
  getBodyParts,
  searchVideos,
  generatePlan,
  savePlan,
  getPlans,
  getPlanById,
  downloadPlan,
  deletePlan,
} from "../controllers/workout.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Existing custom workouts
router.get("/", protect, getWorkouts);
router.post("/", protect, createWorkout);

// Exercise Explorer (Feature 1 & 2)
router.get("/exercises/body-parts", protect, getBodyParts);
router.get("/exercises/:id", protect, getExerciseDetail);
router.get("/exercises", protect, listExercises);

// YouTube Workout Videos (Feature 3)
router.get("/videos", protect, searchVideos);

// AI Workout Generator (Feature 4 & 5)
router.post("/ai/generate", protect, generatePlan);

// Save & Manage Plans (Feature 6, 7, 8)
router.get("/plans/:id/download", protect, downloadPlan);
router.get("/plans/:id", protect, getPlanById);
router.delete("/plans/:id", protect, deletePlan);
router.post("/plans", protect, savePlan);
router.get("/plans", protect, getPlans);

export default router;
