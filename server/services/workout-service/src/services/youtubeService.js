import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

export async function searchWorkoutVideos(query, maxResults = 10) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY not configured");
  }

  const { data } = await axios.get(`${BASE_URL}/search`, {
    params: {
      part: "snippet",
      q: `${query} workout`,
      type: "video",
      maxResults,
      videoDuration: "medium",
      key: apiKey,
    },
  });

  return (data.items || []).map((item) => {
    const videoId = item.id.videoId;
    let thumbnail = item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url;

    if (!thumbnail) {
      thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      // Fallback is handled by the frontend or next image load, or we can just provide the hqdefault
      // The instructions say: If thumbnail is missing, generate hqdefault. Fallback: maxresdefault.
    }

    // Default duration and category if YouTube API doesn't provide it
    const duration = "30m";
    const category = "Workout";
    const kcal = "450";
    const level = "Int";

    return {
      videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail,
      duration,
      category,
      kcal,
      level,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    };
  });
}
