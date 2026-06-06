import prisma from "../config/prisma.js";

/**
 * Generate 6-digit numeric OTP string
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Save OTP to DB (Plain text for easier debug, as requested)
 * Deletes any existing OTPs for the same email first.
 */
export const saveOTP = async (email, otp) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry
  
  console.log(`[OTP_GENERATE] Email: ${email}, OTP: ${otp}, ExpiresAt: ${expiresAt}`);

  // Clean old OTPs
  await prisma.oTP.deleteMany({ where: { email } });

  return await prisma.oTP.create({
    data: {
      email,
      otp: otp.toString(), // Store as string
      expiresAt,
      verified: false,
    },
  });
};

/**
 * Verify OTP from DB
 * Includes checks for: existence, expiry, and string match.
 * DELETES OTP after successful verification.
 */
export const verifyOTPinDB = async (email, otp) => {
  console.log(`[OTP_VERIFY_ATTEMPT] Email: ${email}, Incoming OTP: ${otp}`);

  const record = await prisma.oTP.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' }
  });

  if (!record) {
    console.log(`[OTP_VERIFY_FAIL] No record found for email: ${email}`);
    return false;
  }

  const now = new Date();
  const isExpired = record.expiresAt < now;

  console.log(`[OTP_DEBUG] Stored OTP: ${record.otp}, Expiry: ${record.expiresAt}, IsExpired: ${isExpired}`);

  // 1. Expiry Check
  if (isExpired) {
    console.log(`[OTP_VERIFY_FAIL] OTP expired for email: ${email}`);
    await prisma.oTP.delete({ where: { id: record.id } }); // Cleanup expired
    return "EXPIRED";
  }

  // 2. Value Check (Strict string match)
  if (record.otp !== otp.toString()) {
    console.log(`[OTP_VERIFY_FAIL] Mismatch! Expected ${record.otp}, got ${otp}`);
    return "INVALID";
  }

  // 3. Success -> Delete OTP to prevent reuse
  console.log(`[OTP_VERIFY_SUCCESS] Validated OTP for ${email}. Deleting record...`);
  await prisma.oTP.delete({ where: { id: record.id } });

  return "SUCCESS";
};
