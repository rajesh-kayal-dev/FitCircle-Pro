import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

/**
 * Parse ISO 8601 duration (e.g. PT15M30S) to human-readable "15:30"
 */
function parseISODuration(iso) {
  if (!iso) return "—";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "—";
  const h = parseInt(match[1] || "0");
  const m = parseInt(match[2] || "0");
  const s = parseInt(match[3] || "0");
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export async function searchWorkoutVideos(query, maxResults = 10) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY not configured");
  }

  // Step 1: search for video IDs + snippet
  const searchRes = await axios.get(`${BASE_URL}/search`, {
    params: {
      part:          "snippet",
      q:             `${query} workout`,
      type:          "video",
      maxResults,
      videoDuration: "medium",
      key:           apiKey,
    },
  });

  const items = searchRes.data.items || [];
  if (items.length === 0) return [];

  // Step 2: fetch real durations via contentDetails
  const videoIds = items.map((item) => item.id.videoId).join(",");
  const detailsRes = await axios.get(`${BASE_URL}/videos`, {
    params: {
      part: "contentDetails,statistics",
      id:   videoIds,
      key:  apiKey,
    },
  });

  // Build a lookup map: videoId → { duration, viewCount }
  const detailsMap = {};
  for (const v of detailsRes.data.items || []) {
    detailsMap[v.id] = {
      duration:  parseISODuration(v.contentDetails?.duration),
      viewCount: parseInt(v.statistics?.viewCount || "0"),
    };
  }

  return items.map((item) => {
    const videoId  = item.id.videoId;
    const details  = detailsMap[videoId] || {};

    // Best quality thumbnail — prefer maxresdefault, fall back to hqdefault
    const thumbnail =
      item.snippet.thumbnails?.maxres?.url ||
      item.snippet.thumbnails?.high?.url   ||
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    // Rough calorie estimate from duration (not scientific, just a display value)
    const durationParts = details.duration?.split(":") || [];
    const totalMinutes  =
      durationParts.length === 3
        ? parseInt(durationParts[0]) * 60 + parseInt(durationParts[1])
        : parseInt(durationParts[0] || "30");
    const kcal = Math.round(totalMinutes * 7); // ~7 kcal/min moderate workout

    return {
      videoId,
      title:        item.snippet.title,
      description:  item.snippet.description,
      thumbnail,
      duration:     details.duration || "—",
      category:     "Workout",
      kcal:         String(kcal || 200),
      level:        "Int",
      channelTitle: item.snippet.channelTitle,
      publishedAt:  item.snippet.publishedAt,
      viewCount:    details.viewCount || 0,
    };
  });
}

