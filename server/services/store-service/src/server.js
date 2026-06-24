import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import prisma from "./config/prismaClient.js";

const PORT = process.env.PORT || 5004;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Prisma connected ✅");
  } catch (error) {
    console.warn("Database connection failed ❌ — server will still start (cart/order features unavailable)");
  }

  app.listen(PORT, () => {
    console.log(`Store Service running on port ${PORT}`);
  });
}

startServer();