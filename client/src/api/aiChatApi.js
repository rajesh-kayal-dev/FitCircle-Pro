/**
 * FitCirclePro — AI Chat API wrapper
 * Sends conversation history to the chat-service AI endpoint
 * and returns the agent's reply + metadata.
 */

const CHAT_SERVICE_URL = "http://localhost:5007/api/chat";

/**
 * Detect plan generation trigger words in the user's text
 */
export function isPlanTrigger(text = "") {
  const t = text.toLowerCase().trim();
  return (
    t.includes("download plan") ||
    t.includes("generate plan") ||
    t.includes("create plan") ||
    t.includes("make my plan") ||
    t.includes("build my plan")
  );
}

/**
 * Send a message to a specific AI fitness agent.
 * @param {string} agentId - e.g. "fitcoach_ai", "weightloss_ai"
 * @param {Array<{role: string, content: string}>} messages - conversation history
 * @returns {Promise<{reply: string, agentName: string, isPlan: boolean}>}
 */
export async function sendMessageToAgent(agentId, messages) {
  const response = await fetch(`${CHAT_SERVICE_URL}/ai/${agentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "AI agent request failed");
  }

  return response.json(); // { reply, agentId, agentName, isPlan }
}
