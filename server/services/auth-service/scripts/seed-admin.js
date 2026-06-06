import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = "admin@fitcircle.com";
  const password = "admin1234";
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`Seeding admin user: ${email}...`);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email,
      password: hashedPassword,
      role: "ADMIN",
      name: "Super Admin",
      isOnboarded: true,
    },
  });

  console.log("Admin user seeded successfully! ✅");
  console.log(admin);
}

main()
  .catch((e) => {
    console.error("Error seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
