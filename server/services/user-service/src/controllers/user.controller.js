import prisma from "../config/prisma.js";

export const createProfile = async (req, res) => {
  try {
    const { userId, name, email } = req.body;

    if (!userId || !name || !email) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      return res.json(existing);
    }


    const profile = await prisma.userProfile.create({
      data: {
        userId,
        name,
        email,
      },
    });

    res.status(201).json({
      message: "Profile created ✅",
      profile,
    });
  } catch (error) {
    console.error("CREATE PROFILE ERROR Details:", error.message || error);
    res.status(500).json({ message: "Error creating profile ❌" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (profile) {
      return res.json(profile);
    }

    // Fallback for new users who don't have a UserProfile record yet
    res.json({
      userId,
      name: req.user.name || "User",
      email: req.user.email || "",
      bio: "",
      location: "",
      phone: "",
      profileImage: null,
      avatar: null,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Error fetching profile ❌" });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const profileImageUrl = req.file.path;

    // Use upsert to handle cases where the profile record might not exist yet
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        profileImage: profileImageUrl,
        avatar: profileImageUrl,
      },
      create: {
        userId,
        profileImage: profileImageUrl,
        avatar: profileImageUrl,
        name: req.user.name || "",
        email: req.user.email || "",
      },
    });

    res.json({
      message: "Profile image updated ✅",
      profileImage: profileImageUrl,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("UPLOAD PROFILE IMAGE ERROR:", error);
    res.status(500).json({ message: "Error uploading profile image ❌" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio, location, phone } = req.body;

    console.log(`[USER_CONTROLLER] Updating profile for userId: ${userId}`);
    console.log(`[USER_CONTROLLER] Data:`, { name, bio, location, phone });

    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        name: name || "",
        bio: bio || "",
        location: location || "",
        phone: phone || "",
      },
      create: {
        userId,
        name: name || "",
        bio: bio || "",
        location: location || "",
        phone: phone || "",
        email: req.user.email || "",
      },
    });

    res.json({
      message: "Profile updated ✅",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("CRITICAL: UPDATE PROFILE ERROR STACK:", error);
    res.status(500).json({ 
      message: "Error updating profile ❌",
      error: error.message,
      code: error.code
    });
  }
};

export const getAllProfilesAdmin = async (req, res) => {
  try {
    const profiles = await prisma.userProfile.findMany();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all profiles ❌" });
  }
};

export const deleteProfileAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    await prisma.userProfile.delete({ where: { userId } });
    res.json({ message: "Profile deleted successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile ❌" });
  }
};