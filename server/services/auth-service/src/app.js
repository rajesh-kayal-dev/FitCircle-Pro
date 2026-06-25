import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

const app = express();


app.use(cors({
    origin: ["http://localhost:5173", "https://fit-circle-pro.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());


app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Auth Service Running 🔐");
});


export default app;