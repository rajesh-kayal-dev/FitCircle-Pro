import express from "express";
import { 
  createProfile, 
  getProfile, 
  uploadProfileImage, 
  updateProfile,
  getAllProfilesAdmin,
  deleteProfileAdmin
} from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";
import prisma from "../config/prisma.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// protect
router.get("/me", protect, getProfile);
router.post("/upload-profile", protect, upload.single("image"), uploadProfileImage);
router.put("/update", protect, updateProfile);

// Admin Routes
router.get("/admin/profiles", getAllProfilesAdmin);
router.delete("/admin/:userId", deleteProfileAdmin);

// GET by ID
router.get("/:id", async (req, res) => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.params.id },
    });

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error ❌" });
  }
});

// internal (auth service) - check if user exists by email
router.get("/internal/check/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const profile = await prisma.userProfile.findUnique({
      where: { email },
    });
    res.json({ exists: !!profile, profile });
  } catch (error) {
    res.status(500).json({ message: "Internal error checking profile ❌" });
  }
});

router.post("/create", createProfile);


export default router;