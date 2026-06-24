import axios from "axios";

const TAVILY_API_URL = "https://api.tavily.com/search";

export const searchTavily = async (query) => {
  try {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      console.warn("TAVILY_API_KEY is missing. Returning mock data.");
      return getMockArticles();
    }

    const response = await axios.post(TAVILY_API_URL, {
      api_key: apiKey,
      query: query,
      search_depth: "basic",
      include_images: true,
      max_results: 5,
    });

    if (!response.data || !response.data.results) return [];

    return response.data.results.map(item => ({
      id: item.url,
      type: "article",
      title: item.title,
      summary: item.content.substring(0, 150) + "...",
      url: item.url,
      image: item.images?.[0] || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=300",
    }));
  } catch (error) {
    console.error("Tavily Search Error:", error.response?.data || error.message);
    return getMockArticles();
  }
};

export const getTrending = async () => {
  return await searchTavily("Latest trending fitness topics and workouts 2024");
};

export const searchTrainers = async (query) => {
  try {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) return [];

    const response = await axios.post(TAVILY_API_URL, {
      api_key: apiKey,
      query: query.toLowerCase().includes('trainer') ? query : `${query} personal trainer`,
      search_depth: "basic",
      include_images: true,
      max_results: 5,
    });

    if (!response.data || !response.data.results) return [];

    return response.data.results.map(item => ({
      id: item.url,
      type: "trainer",
      title: item.title.split('|')[0].split('-')[0].trim(), // Try to extract clean name
      image: item.images?.[0] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop",
      specialization: item.content.substring(0, 50) + "...",
      followers: "Web Result",
      url: item.url
    }));
  } catch (error) {
    console.error("Tavily Trainer Search Error:", error.response?.data || error.message);
    return [];
  }
};

function getMockArticles() {
  return [
    {
      id: "mock1",
      type: "article",
      title: "10 Best Workouts for Fat Loss",
      summary: "Discover the most scientifically proven methods to burn fat quickly while maintaining muscle mass.",
      url: "#",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: "mock2",
      type: "article",
      title: "The Ultimate Guide to Creatine",
      summary: "Everything you need to know about creatine monohydrate, dosing, and its benefits for strength.",
      url: "#",
      image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&q=80&w=300"
    }
  ];
}
