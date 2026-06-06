import prisma from "../config/prisma.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { transporter } from "../config/nodemailer.js";
import { generateOTP, saveOTP, verifyOTPinDB } from "../services/otp.service.js";
import { getOTPEmailTemplate } from "../utils/emailTemplate.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5002";

/**
 * Internal helper to check if a profile exists in the User Service
 */
const checkProfileExists = async (email) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/api/users/internal/check/${email}`);
    return response.data.exists;
  } catch (err) {
    console.error(`[AUTH_CONTROLLER] Error checking profile for ${email}:`, err.message);
    return false; // Safely assume new user on error, or you could return true to block them
  }
};

/**
 * 1. Send OTP (Login or Register)
 */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const otp = generateOTP();
    await saveOTP(email, otp);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "FitCircle Pro - Login Verification Code",
      html: getOTPEmailTemplate(otp),
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[DEV] OTP for ${email}: ${otp}`);
    }

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/**
 * 2. Verify OTP & JWT Session
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(`[CONTROLLER_VERIFY] Attempting verification for ${email}`);
    
    const result = await verifyOTPinDB(email, otp);

    if (result === "EXPIRED") {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }
    
    if (result === "INVALID" || !result) {
      return res.status(400).json({ message: "Invalid OTP. Please check and try again." });
    }

    // result is "SUCCESS"
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log(`[CONTROLLER_VERIFY] Creating new user for ${email}`);
      user = await prisma.user.create({
        data: { email }
      });
    }

    // Check if user is blocked
    if (user.status === "BANNED") {
      return res.status(403).json({ 
        message: "Your account has been blocked temporarily. Please contact support." 
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, isOnboarded: user.isOnboarded }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    // Use the actual DB field — single source of truth
    const isNewUser = !user.isOnboarded;

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isOnboarded: user.isOnboarded
      },
      isNewUser,
    });
  } catch (error) {
    console.error("Verify OTP Controller Error:", error);
    res.status(500).json({ message: "Verification system error. Please try later." });
  }
};

/**
 * 3. Google Login (Supports ID Token and Access Token)
 */
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Credential is required" });
    }

    let email, name;

    // Detect if it's an ID Token (JWT format) or an Access Token (starts with ya29)
    const isIdToken = credential.split(".").length === 3 || credential.startsWith("eyJ");

    if (isIdToken) {
      console.log("[GOOGLE_LOGIN] Verifying ID Token...");
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
    } else {
      console.log("[GOOGLE_LOGIN] Fetching userinfo via Access Token...");
      const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${credential}` }
      });
      email = response.data.email;
      name = response.data.name;
    }

    if (!email) {
      return res.status(400).json({ message: "Failed to retrieve email from Google" });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log(`[GOOGLE_LOGIN] Creating new user record for ${email}`);
      user = await prisma.user.create({
        data: { email, name: name || email.split('@')[0] }
      });
    }

    // Check if user is blocked
    if (user.status === "BANNED") {
      return res.status(403).json({ 
        message: "Your account has been blocked temporarily. Please contact support." 
      });
    }

    // ── NEW: Instead of returning token, send OTP ──
    const otp = generateOTP();
    await saveOTP(email, otp);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "FitCircle Pro - Google Login Verification",
      html: getOTPEmailTemplate(otp),
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[DEV] Google Login OTP for ${email}: ${otp}`);
    }

    res.json({
      otpSent: true,
      email: user.email,
      message: "OTP sent to your Google email. Please verify."
    });
  } catch (error) {
    console.error("Google Login Error:", error.message || error);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

/**
 * 4. Complete Onboarding (Update Profile)
 */
export const completeOnboarding = async (req, res) => {
  try {
    const { name, age, gender } = req.body;
    const userId = req.user.id; // From authMiddleware

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        age: parseInt(age),
        gender,
        isOnboarded: true,
      },
    });

    // Sync with User Service
    try {
      await axios.post(`${USER_SERVICE_URL}/api/users/create`, {
        userId: user.id,
        name: user.name,
        email: user.email
      });
    } catch (err) {
      console.warn(`[AUTH_CONTROLLER] Failed to sync onboarding with User Service: ${err.message}`);
    }

    res.json({
      message: "Onboarding completed successfully ✅",
      user,
    });
  } catch (error) {
    console.error("Complete Onboarding Error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/**
 * 5. Get Current User Info
 */
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 6. Admin Login (Credential-based)
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.role !== "ADMIN") {
      return res.status(401).json({ message: "Invalid credentials or access denied" });
    }

    const bcrypt = await import("bcryptjs").then(m => m.default);
    const isMatch = await bcrypt.compare(password, user.password || "");
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if admin is blocked (just in case)
    if (user.status === "BANNED") {
      return res.status(403).json({ 
        message: "Your account has been blocked temporarily. Please contact support." 
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isOnboarded: user.isOnboarded
      }
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Server error during admin login" });
  }
};

/**
 * 7. Admin: Get All Users (Consolidated with Profile)
 */
export const getUsersAdmin = async (req, res) => {
  try {
    // 1. Get all users from Auth DB
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });

    // 2. Fetch profiles from User Service
    const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5002";
    
    let profiles = [];
    try {
      const response = await axios.get(`${USER_SERVICE_URL}/api/users/admin/profiles`);
      profiles = response.data;
    } catch (err) {
      console.warn("[ADMIN_CONTROLLER] Could not fetch profiles from User Service.");
    }

    // 3. Map profiles to users
    const consolidatedUsers = users.map(user => {
      const profile = profiles.find(p => p.userId === user.id);
      return {
        ...user,
        profileImage: profile?.profileImage || profile?.avatar || null,
        displayName: profile?.name || user.name || "User",
        bio: profile?.bio || "",
        followers: "0",
        joined: user.createdAt.toISOString().split('T')[0]
      };
    });

    res.json(consolidatedUsers);
  } catch (error) {
    console.error("GET USERS ADMIN ERROR:", error);
    res.status(500).json({ message: "Error fetching user list ❌" });
  }
};

/**
 * 8. Admin: Toggle User Block (ACTIVE <-> BANNED)
 */
export const toggleUserBlockAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const newStatus = user.status === "BANNED" ? "ACTIVE" : "BANNED";

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status: newStatus }
    });

    res.json({
      message: `User status updated to ${newStatus} ✅`,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user status ❌" });
  }
};

/**
 * 9. Admin: Delete User (Auth + User Profile)
 */
export const deleteUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Delete from Auth Service
    await prisma.user.delete({ where: { id } });

    // 2. Trigger deletion in User Service
    const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5002";
    try {
      await axios.delete(`${USER_SERVICE_URL}/api/users/admin/${id}`);
    } catch (err) {
      console.warn(`[ADMIN_CONTROLLER] Profile deletion failed for ${id} in User Service.`);
    }

    res.json({ message: "User and profile deleted successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user ❌" });
  }
};