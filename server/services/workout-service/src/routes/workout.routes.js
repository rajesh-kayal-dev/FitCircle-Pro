import express from "express";
import {
    createWorkout,
    getWorkouts,
} from "../controllers/workout.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// create workout
router.post("/", protect, createWorkout);

// get workouts
router.get("/", protect, getWorkouts);

export default router;