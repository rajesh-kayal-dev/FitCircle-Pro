import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Chat Service Running 💬");
});

export default app;