import express from "express";
import { getMessages } from "../controllers/chat.controller.js";
import { chatWithAgent, getAgents } from "../controllers/ai.controller.js";

const router = express.Router();

// GET messages between two users
router.get("/:userId/:otherUserId", getMessages);

// GET list of all AI agents (public — no auth needed)
router.get("/ai/agents", getAgents);

// POST message to a specific AI fitness agent
router.post("/ai/:agentId", chatWithAgent);

export default router;