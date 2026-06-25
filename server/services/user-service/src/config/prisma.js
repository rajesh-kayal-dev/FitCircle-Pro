import "dotenv/config";
import { PrismaClient } from "../../prisma/generated/client/index.js";

const prisma = new PrismaClient({
  log: ["error"],
});

/**
 * Connects to the Neon database with exponential backoff.
 * Neon free-tier databases "sleep" after inactivity, so the first
 * connection attempt may fail while the instance is waking up.
 */
async function connectWithRetry(retries = 10, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$connect();
      console.log("Prisma connected (user-service) ✅");
      return;
    } catch (err) {
      const isLastAttempt = attempt === retries;
      console.warn(
        `⏳ Neon DB not ready yet (attempt ${attempt}/${retries}). ${
          isLastAttempt ? "Giving up." : `Retrying in ${delayMs / 1000}s...`
        }`
      );
      if (isLastAttempt) {
        console.error("Prisma connection failed (user-service) ❌", err.message);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      delayMs = Math.min(delayMs * 1.5, 15000);
    }
  }
}

connectWithRetry();

export default prisma;