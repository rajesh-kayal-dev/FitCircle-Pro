import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import routes from "./routes/index.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Cross-Origin-Opener-Policy for Google OAuth Popups
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});

app.use(express.json());

// Routes
app.use("/api", routes);

app.get('/', (req, res) => {
    res.send('API Gateway is running');
});

const PORT = process.env.PORT ;

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});