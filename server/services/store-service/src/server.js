import dotenv from "dotenv";
import app from "./app.js";
import prisma from "./config/prismaClient.js";

dotenv.config();

const PORT = process.env.PORT || 5004;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Prisma connected ✅");
    
    app.listen(PORT, () => {
      console.log(`Store Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed ❌", error);
    process.exit(1);
  }
}

startServer();