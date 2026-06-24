import axios from "axios";

export const searchYoutube = async (query) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.warn("YOUTUBE_API_KEY is missing. Returning mock videos.");
      return getMockVideos();
    }

    const url = `https://www.googleapis.com/youtube/v3/search`;
    const response = await axios.get(url, {
      params: {
        part: "snippet",
        q: query,
        maxResults: 5,
        type: "video",
        key: apiKey
      }
    });

    if (!response.data || !response.data.items) return [];

    return response.data.items.map(item => ({
      id: item.id.videoId,
      type: "video",
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      image: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
  } catch (error) {
    console.error("YouTube Search Error:", error.response?.data || error.message);
    return getMockVideos();
  }
};

function getMockVideos() {
  return [
    {
      id: "mock-v1",
      type: "video",
      title: "20 Min Full Body Workout - No Equipment",
      channel: "Pamela Reif",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=300",
      url: "https://www.youtube.com/watch?v=mock"
    },
    {
      id: "mock-v2",
      type: "video",
      title: "Science-Based Chest Workout for Growth",
      channel: "Jeff Nippard",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=300",
      url: "https://www.youtube.com/watch?v=mock2"
    }
  ];
}
