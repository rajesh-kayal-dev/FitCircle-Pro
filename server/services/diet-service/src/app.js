import express from "express";
import cors from "cors";

import dietRoutes from "./routes/diet.routes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/diet", dietRoutes);

app.get("/", (req, res) => {
  res.send("Diet Service Running 🥗");
});

export default app;