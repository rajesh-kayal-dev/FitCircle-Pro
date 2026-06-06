import express from "express";
import { getMessages } from "../controllers/chat.controller.js";

const router = express.Router();

// GET messages
router.get("/:userId/:otherUserId", getMessages);

export default router;