import "dotenv/config";
import app from "./app.js";
import prisma from "./config/prisma.js";

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    console.log("Connecting to database... ⏳");
    await prisma.$connect();
    console.log("Database connected successfully! ✅");

    app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT} 👤`);
    });
  } catch (error) {
    console.error("FAILED TO START SERVER: Database connection error ❌", error);
    process.exit(1);
  }
};

startServer();