import Workout from "../models/Workout.js";

// create workout
export const createWorkout = async (req, res) => {
  try {
    const { title, exercises } = req.body;

    const workout = await Workout.create({
      userId: req.user.id,
      title,
      exercises,
    });

    res.status(201).json({
      message: "Workout created ✅",
      workout,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating workout ❌" });
  }
};

// get all workouts (user specific)
export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workouts ❌" });
  }
};