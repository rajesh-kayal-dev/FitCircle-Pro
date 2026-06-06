import express from "express";
import cors from "cors";

import workoutRoutes from "./routes/workout.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/workouts", workoutRoutes);

app.get("/", (req, res) => {
  res.send("Workout Service Running 🏋️");
});

export default app;