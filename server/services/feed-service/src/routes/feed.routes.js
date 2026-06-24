import express from "express";
import { createPost, getPosts, toggleLike, addComment, getReels, toggleReelLike, addReelComment, getReelComments, addStoryComment, getStoryComments, getRedditPosts, getTrendingTopics, getDiscoverFeed, likeFeedPost, unlikeFeedPost, getFeedComments, addFeedComment, shareFeedPost, saveFeedPost, unsaveFeedPost, getSavedFeedPosts } from "../controllers/feed.controller.js";
import protect from "../middleware/auth.moddleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

//upload image
router.post("/", protect, upload.single("media"), createPost);

// add comment (legacy)
router.post("/:id/comment", protect, addComment);

// like/unlike (legacy)
router.put("/:id/like", protect, toggleLike);

// protected route
router.post("/", protect, createPost);

// reels routes
router.get("/reels", getReels);
router.post("/reels/:reelId/like", protect, toggleReelLike);
router.post("/reels/:reelId/comment", protect, addReelComment);
router.get("/reels/:reelId/comments", getReelComments);

// stories routes
router.post("/stories/:storyId/comment", protect, addStoryComment);
router.get("/stories/:storyId/comments", getStoryComments);

// public route
router.get("/", getPosts);

// discover feed routes
router.get("/reddit", getRedditPosts);
router.get("/trending", getTrendingTopics);
router.get("/discover", getDiscoverFeed);

// ─── Feed Item Interactions (Discover Feed) ────────────────────────────
router.post("/posts/:id/like", protect, likeFeedPost);
router.delete("/posts/:id/like", protect, unlikeFeedPost);
router.get("/posts/:id/comments", getFeedComments);
router.post("/posts/:id/comments", protect, addFeedComment);
router.post("/posts/:id/share", protect, shareFeedPost);
router.post("/posts/:id/save", protect, saveFeedPost);
router.delete("/posts/:id/save", protect, unsaveFeedPost);
router.get("/posts/saved", protect, getSavedFeedPosts);

export default router;