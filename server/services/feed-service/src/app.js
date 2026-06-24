import express from "express";
import cors from "cors";

import feedRoutes from "./routes/feed.routes.js";
import exploreRoutes from "./routes/explore.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/feed", feedRoutes);
app.use("/api/explore", exploreRoutes);

// test
app.get("/", (req, res) => {
  res.send("Feed Service Running 📸");
});

export default app;