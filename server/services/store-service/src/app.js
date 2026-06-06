import express from "express";
import cors from "cors";

import storeRoutes from "./routes/store.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/store", storeRoutes);

// test
app.get("/", (req, res) => {
  res.send("Store Service Running 🛒");
});

export default app;