import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import routes from "./routes/index.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://fit-circle-pro.vercel.app",
    ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

app.use(cors({
    origin: allowedOrigins,
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

// Health check endpoint — used by Docker and monitoring
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'fitcircle-gateway',
        timestamp: new Date().toISOString(),
    });
});

const PORT = process.env.PORT || 7860;

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});