import Groq from "groq-sdk";

export const detectIntent = async (query) => {
  // Initialize Groq (requires GROQ_API_KEY in environment)
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    const prompt = `
You are a search intent classifier and fitness expert for a fitness app.
First, classify the user's search query into ONE of the following intents:
- workout
- nutrition
- trainer
- supplement
- fitness_news

Second, if the query is an informational question that has a direct, short answer (e.g., "how much protein in eggs", "what is bmi"), provide a quick summary.
If it is a broad query (e.g., "best workout for chest", "home workout routine"), do NOT provide a direct answer.

Output MUST be a valid JSON object with the following schema:
{
  "intent": "string",
  "hasDirectAnswer": "boolean",
  "title": "string (e.g. 'Quick Answer', only if hasDirectAnswer is true)",
  "summary": "string (max 2 lines, human-friendly, no markdown, no bullet points, only if hasDirectAnswer is true)"
}

Query: "${query}"
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{"intent":"fitness_news", "hasDirectAnswer": false}');
    return result;
  } catch (error) {
    console.error("Groq Intent Classification Error:", error);
    return { intent: "fitness_news", hasDirectAnswer: false };
  }
};

export const extractTrainersFromSearch = async (query, searchResults) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    const context = searchResults.map(r => `Title: ${r.title}\nContent: ${r.specialization}\nURL: ${r.url}`).join("\n\n");
    const prompt = `
You are a fitness expert. Extract a list of specific fitness trainer names (human names, e.g., 'Jeff Nippard', 'Kaushik Bose') from the following search results for the query: "${query}".
If a result is a directory or list, try to guess or extract a single human name if possible. If no human name is found, use a clean brand name.
Do not include phrases like 'Top 10' or 'Best Gym Trainer'. Just the name.

Search Results Context:
${context}

Output MUST be a valid JSON object with exactly one key "trainers" containing an array of objects with this schema:
{
  "trainers": [
    {
      "id": "unique-id-string",
      "type": "trainer",
      "title": "Clean Trainer Name",
      "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop",
      "specialization": "Their specialization or a short 1-line description",
      "followers": "Local Pro",
      "url": "their url from the context"
    }
  ]
}
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }, // Wait, json_object requires an object. Let's return an object with "trainers" array.
      temperature: 0.2,
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{"trainers":[]}');
    return parsed.trainers || [];
  } catch (error) {
    console.error("Groq Trainer Extraction Error:", error);
    return searchResults; // Fallback to raw results
  }
};

export const enrichFeedItems = async (items) => {
  if (!items || items.length === 0) return [];
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  try {
    const itemsJson = JSON.stringify(items.map((item, index) => ({
      index,
      title: item.title,
      summary: item.summary || item.description || "",
      source: item.source
    })));

    const prompt = `
You are a fitness content editor. I will provide you with a list of raw fitness content items. 
For each item, I want you to:
1. Rewrite the "title" to be catchy, concise, and non-clickbaity.
2. Provide a 2-line "summary" (max 150 characters) summarizing the core fitness value.
3. Classify it into one of these strict categories: "Workout", "Nutrition", "Weight Loss", "Muscle Gain", "Motivation", "Exercise Science", "Recovery".

Raw Items:
${itemsJson}

Output MUST be a valid JSON object with exactly one key "enriched" containing an array of objects in the same order.
Schema:
{
  "enriched": [
    {
      "index": 0,
      "title": "New Catchy Title",
      "summary": "Short 2 line summary here.",
      "category": "Workout"
    }
  ]
}
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{"enriched":[]}');
    const enrichedData = parsed.enriched || [];

    // Merge back into original items
    return items.map((item, idx) => {
      const enrichedMatch = enrichedData.find(e => e.index === idx);
      if (enrichedMatch) {
        return {
          ...item,
          title: enrichedMatch.title,
          summary: enrichedMatch.summary,
          category: enrichedMatch.category
        };
      }
      return item; // fallback
    });
  } catch (error) {
    console.error("Groq Enrichment Error:", error);
    return items; // Fallback to raw items
  }
};
