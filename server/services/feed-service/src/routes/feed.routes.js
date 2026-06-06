import express from "express";
import { createPost, getPosts, toggleLike, addComment } from "../controllers/feed.controller.js";
import protect from "../middleware/auth.moddleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

//upload image
router.post("/", protect, upload.single("media"), createPost);

// add comment
router.post("/:id/comment", protect, addComment);

// like/unlike
router.put("/:id/like", protect, toggleLike);

// protected route
router.post("/", protect, createPost);

// public route
router.get("/", getPosts);

export default router;