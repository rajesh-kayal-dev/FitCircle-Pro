import NodeCache from "node-cache";
import { searchTavily } from "./tavily.service.js";
import { searchYoutube } from "./youtube.service.js";
import { searchExercises } from "./exercisedb.service.js";
import { enrichFeedItems } from "./intelligence.service.js";

// Cache for 30 minutes
const cache = new NodeCache({ stdTTL: 1800 });

// Helper to generate realistic engagement metrics
const generateEngagement = (minLikes, maxLikes, minComments, maxComments) => {
  return {
    likes: Math.floor(Math.random() * (maxLikes - minLikes + 1)) + minLikes,
    comments: Math.floor(Math.random() * (maxComments - minComments + 1)) + minComments,
  };
};

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getDynamicFeed = async (category = "", limit = 20) => {
  const cacheKey = `dynamic_feed_${category}_${limit}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    let queries = [];
    if (category && category !== "All") {
      queries = [category];
    } else {
      queries = [
        "fitness transformation",
        "weight loss journey",
        "muscle gain tips",
        "protein nutrition",
        "workout motivation",
        "home workout",
        "gym mistakes",
        "exercise science",
      ];
    }

    // Pick 2-3 random queries to avoid overloading
    const selectedQueries = queries.sort(() => 0.5 - Math.random()).slice(0, 3);

    // Fetch data in parallel
    const tavilyPromises = selectedQueries.map(q => searchTavily(q));
    const youtubePromises = selectedQueries.map(q => searchYoutube(q));
    
    // For ExerciseDB, pick a random muscle group or exercise
    const exerciseQueries = ["chest", "back", "legs", "shoulders", "arms"];
    const exercisedbPromises = selectedQueries.map(() => searchExercises(getRandomItem(exerciseQueries)));

    const rawTavilyResults = (await Promise.all(tavilyPromises)).flat();
    const rawYoutubeResults = (await Promise.all(youtubePromises)).flat();
    const rawExerciseResults = (await Promise.all(exercisedbPromises)).flat();

    let rawFeedItems = [];

    // Map Tavily
    rawTavilyResults.forEach(item => {
      rawFeedItems.push({
        id: item.id || `tavily-${Date.now()}-${Math.random()}`,
        source: "Tavily",
        title: item.title,
        summary: item.summary,
        image: item.image,
        url: item.url,
        author: {
          name: "Web Article",
          avatar: "https://ui-avatars.com/api/?name=Web&background=random"
        },
        publishedAt: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 7),
        engagement: generateEngagement(50, 2000, 5, 200),
        isVideo: false
      });
    });

    // Map Youtube
    rawYoutubeResults.forEach(item => {
      rawFeedItems.push({
        id: item.id || `yt-${Date.now()}-${Math.random()}`,
        source: "YouTube",
        title: item.title,
        summary: `Video by ${item.channel}`,
        image: item.image,
        url: item.url,
        author: {
          name: item.channel,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.channel)}&background=random`
        },
        publishedAt: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 14),
        engagement: generateEngagement(500, 15000, 50, 1000),
        isVideo: true,
        fallbackUrl: item.url
      });
    });

    // Map ExerciseDB
    rawExerciseResults.forEach(item => {
      rawFeedItems.push({
        id: item.id || `ex-${Date.now()}-${Math.random()}`,
        source: "ExerciseDB",
        title: item.title,
        summary: `Target: ${item.target}, Body Part: ${item.bodyPart}, Equipment: ${item.equipment}`,
        image: item.image,
        url: "#",
        author: {
          name: "FitCircle Database",
          avatar: "https://ui-avatars.com/api/?name=FitCircle&background=random"
        },
        publishedAt: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 30),
        engagement: generateEngagement(10, 500, 0, 50),
        isVideo: true,
        fallbackUrl: item.image // gif
      });
    });

    // Shuffle and slice to limit
    rawFeedItems = rawFeedItems.sort(() => 0.5 - Math.random()).slice(0, limit);

    // Enrich items using Groq
    let enrichedItems = await enrichFeedItems(rawFeedItems);

    // Filter if category requested
    if (category && category !== "All") {
       enrichedItems = enrichedItems.filter(item => 
         item.category && item.category.toLowerCase().includes(category.toLowerCase())
       );
    }

    const result = {
      posts: enrichedItems,
      after: null 
    };

    cache.set(cacheKey, result);
    return result;

  } catch (error) {
    console.error("FeedAggregator Error:", error);
    return { posts: [], after: null };
  }
};
