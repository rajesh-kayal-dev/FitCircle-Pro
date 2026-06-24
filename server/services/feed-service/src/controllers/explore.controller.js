import { detectIntent, extractTrainersFromSearch } from "../services/intelligence.service.js";
import { searchTavily, getTrending, searchTrainers } from "../services/tavily.service.js";
import { searchYoutube } from "../services/youtube.service.js";
import { searchExercises } from "../services/exercisedb.service.js";
// OpenFoodFacts search will route to store-service or we can duplicate the lightweight search here for simplicity,
// but it's better to fetch from store-service or just implement a direct OFF fetch.
import axios from "axios";

export const search = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });

    // Step 1: Detect Intent via Groq
    const aiAnalysis = await detectIntent(query);
    const intent = typeof aiAnalysis === 'object' ? aiAnalysis.intent : aiAnalysis;

    let results = [];

    // Step 2: Route to correct service based on intent
    switch (intent) {
      case "workout":
        // Run YouTube and ExerciseDB in parallel
        const [ytWorkouts, dbExercises] = await Promise.all([
          searchYoutube(`${query} workout`),
          searchExercises(query)
        ]);
        results = [...dbExercises, ...ytWorkouts];
        break;

      case "nutrition":
        // Fallback to searching Open Food Facts directly from here to save a network hop, 
        // or we could use Tavily for nutrition advice. We will use Tavily + OFF.
        const [tavilyNutrition, offRes] = await Promise.all([
          searchTavily(`nutrition facts and advice for: ${query}`),
          axios.get(`http://localhost:5004/api/products/search?q=${encodeURIComponent(query)}`).catch(() => ({ data: { foods: [] } }))
        ]);
        results = [...(offRes.data?.foods || []), ...tavilyNutrition];
        break;

      case "trainer":
        const rawTrainers = await searchTrainers(query);
        if (rawTrainers.length > 0) {
          results = await extractTrainersFromSearch(query, rawTrainers);
        }
        if (!results || results.length === 0) {
          // Provide a fallback if Tavily or Groq failed to extract trainers
          results = [
            {
              id: `fallback-trainer-${Date.now()}`,
              type: "trainer",
              title: "Local Fitness Coach",
              image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop",
              specialization: "Personal Training & Nutrition",
              followers: "Top Rated",
              url: "#"
            }
          ];
        }
        break;

      case "supplement":
        results = await searchTavily(`supplement guide: ${query}`);
        break;

      case "fitness_news":
      default:
        results = await searchTavily(query);
        break;
    }

    res.json({
      success: true,
      intent,
      hasDirectAnswer: aiAnalysis?.hasDirectAnswer || false,
      aiTitle: aiAnalysis?.title || null,
      aiSummary: aiAnalysis?.summary || null,
      results
    });
  } catch (error) {
    console.error("Explore Search Error:", error);
    res.status(500).json({ success: false, message: "Failed to perform explore search" });
  }
};

export const trending = async (req, res) => {
  try {
    const results = await getTrending();
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch trending" });
  }
};

export const trainers = async (req, res) => {
  try {
    // For now, mock a list of popular trainers using YouTube or static fallback
    const mockTrainers = [
      { id: "t1", title: "Jeff Nippard", type: "trainer", image: "https://yt3.googleusercontent.com/ytc/AIdro_k6E38n4yR7dKx9aN013oA6K1oD5B6eQvK5fG2sWg=s900-c-k-c0x00ffffff-no-rj", followers: "4.5M", specialization: "Science-based Hypertrophy" },
      { id: "t2", title: "Chris Bumstead", type: "trainer", image: "https://yt3.googleusercontent.com/ytc/AIdro_nL-5S6yT6D3wKxY1r5sL6f5E4S6m_H6F9x5e7g=s900-c-k-c0x00ffffff-no-rj", followers: "3.2M", specialization: "Classic Physique" },
      { id: "t3", title: "Chloe Ting", type: "trainer", image: "https://yt3.googleusercontent.com/ytc/AIdro_k6P7E6y8X9L6C6b6Q6s6d6T6R6E6D6=s900-c-k-c0x00ffffff-no-rj", followers: "25M", specialization: "Home Workouts & Abs" },
      { id: "t4", title: "Athlean-X", type: "trainer", image: "https://yt3.googleusercontent.com/ytc/AIdro_l5G6w7A8B9C0D1E2F3G4H5I6J7K8L9=s900-c-k-c0x00ffffff-no-rj", followers: "13M", specialization: "Physical Therapy & Strength" }
    ];
    res.json({ success: true, results: mockTrainers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch trainers" });
  }
};

export const videos = async (req, res) => {
  try {
    const results = await searchYoutube("best fitness workouts 2024");
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch videos" });
  }
};

export const articles = async (req, res) => {
  try {
    const results = await searchTavily("latest fitness and nutrition research articles");
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch articles" });
  }
};
