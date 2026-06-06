import prisma from "./src/config/prisma.js";

async function test() {
  try {
    const otp = await prisma.oTP.create({
      data: {
        email: "test@example.com",
        otp: "123456",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      }
    });
    console.log("SUCCESS: OTP Table exists", otp);
    await prisma.oTP.delete({ where: { id: otp.id } });
    console.log("Cleanup done.");
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    process.exit(0);
  }
}

test();
