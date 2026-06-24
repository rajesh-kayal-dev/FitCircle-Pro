import axios from "axios";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are an experienced fitness coach. Create realistic workout plans.
Requirements:
- Use common exercises with proper sets and reps
- Mention rest periods between sets
- Match the user's goal, experience level, and available days
- Keep response concise and well-structured
- Return the plan in markdown format only
- Include warm-up and cool-down recommendations`;

function buildUserPrompt({ goal, age, height, weight, location, daysPerWeek, experience }) {
  return `Create a ${goal} workout plan for a ${age}-year-old who is ${height}cm tall and weighs ${weight}kg.
Workout location: ${location === "gym" ? "Gym" : "Home (minimal equipment)"}
Days per week: ${daysPerWeek}
Experience level: ${experience}

Provide:
- A weekly schedule
- Exercise names, sets, reps, and rest periods
- Brief form tips for key exercises`;
}

export async function generateWorkoutPlan(userProfile) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const { data } = await axios.post(
    GROQ_API_URL,
    {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(userProfile) },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    },
    {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data.choices?.[0]?.message?.content || "No plan generated";
}
