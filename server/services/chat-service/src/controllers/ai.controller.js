import Groq from "groq-sdk";
import { getAgent, isPlanGenerationTrigger } from "../agents/agentConfig.js";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * POST /api/chat/ai/:agentId
 * Body: { messages: [{ role: "user"|"assistant", content: string }] }
 * Returns: { reply: string, agentId: string, agentName: string, isPlan: boolean }
 */
export const chatWithAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { messages = [] } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ message: "messages array is required" });
    }

    const agent = getAgent(agentId);

    // Detect if this is a plan generation request
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const planMode = isPlanGenerationTrigger(lastUserMessage?.content || "");

    // Build messages array: system prompt + conversation history (last 30 for plan mode)
    const historyLimit = planMode ? 30 : 20;
    const groqMessages = [
      {
        role: "system",
        content: agent.systemPrompt,
      },
      ...messages.slice(-historyLimit).map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      // Plan generation needs more tokens for the full markdown document
      max_tokens: planMode ? 4096 : 512,
      temperature: planMode ? 0.4 : 0.7,
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({ message: "No response from AI model" });
    }

    // Detect if the reply is a markdown plan (starts with a heading)
    const replyIsPlan = reply.startsWith("# ") || reply.startsWith("# 🏋️");

    return res.json({
      reply,
      agentId: agent.id,
      agentName: agent.name,
      isPlan: replyIsPlan,
    });
  } catch (error) {
    console.error("AI chat error:", error?.message || error);
    return res.status(500).json({
      message: "Failed to get AI response",
      error: error?.message,
    });
  }
};

/**
 * GET /api/chat/ai/agents
 * Returns the list of all available AI agents (for the frontend sidebar)
 */
export const getAgents = async (req, res) => {
  try {
    const { allAgents } = await import("../agents/agentConfig.js");
    // Strip out systemPrompt — frontend doesn't need it
    const publicAgents = allAgents.map(({ systemPrompt, ...rest }) => rest);
    return res.json({ agents: publicAgents });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return res.status(500).json({ message: "Failed to fetch agents" });
  }
};
