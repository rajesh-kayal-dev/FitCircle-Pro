import express from "express";
import rateLimit from "express-rate-limit";
import { 
  googleLogin, 
  sendOtp, 
  verifyOtp, 
  getMe, 
  completeOnboarding, 
  adminLogin,
  getUsersAdmin,
  toggleUserBlockAdmin,
  deleteUserAdmin
} from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { message: "Too many requests, please try again after 5 minutes" },
});

const router = express.Router();

// Role-based protection middleware
const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

router.get("/test", (req, res) => {
  res.json({ message: "Auth service working" });
});

// Auth Routes (No Password)
router.post("/google", googleLogin);
router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", otpLimiter, verifyOtp);
router.post("/admin-login", adminLogin);

// Profile & Onboarding
router.get("/me", protect, getMe);
router.put("/complete-onboarding", protect, completeOnboarding);

// Admin Management
router.get("/admin/users", protect, adminProtect, getUsersAdmin);
router.patch("/admin/users/:id/status", protect, adminProtect, toggleUserBlockAdmin);
router.delete("/admin/users/:id", protect, adminProtect, deleteUserAdmin);

export default router;