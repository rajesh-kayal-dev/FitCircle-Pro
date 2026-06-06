import { PrismaClient } from "@prisma/client";

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
      console.log("Prisma connected (auth-service) ✅");
      return;
    } catch (err) {
      const isLastAttempt = attempt === retries;
      console.warn(
        `⏳ Neon DB not ready yet (attempt ${attempt}/${retries}). ${
          isLastAttempt ? "Giving up." : `Retrying in ${delayMs / 1000}s...`
        }`
      );
      if (isLastAttempt) {
        console.error("Prisma connection failed (auth-service) ❌", err.message);
        // Don't crash the server — requests will fail naturally if DB is down
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      // Increase delay with each retry (exponential backoff, capped at 15s)
      delayMs = Math.min(delayMs * 1.5, 15000);
    }
  }
}

connectWithRetry();

export default prisma;