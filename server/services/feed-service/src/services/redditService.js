import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 900 });

export const getFitnessPosts = async (subreddit = 'Fitness', limit = 20, after = '') => {
  const cacheKey = `${subreddit}_hot_${limit}_${after}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}&after=${after}`, {
      headers: {
        'User-Agent': 'FitCirclePro/1.0.0 (by /u/fitcircle_admin)'
      },
      timeout: 10000
    });
    const posts = response.data.data.children.map(child => {
      const post = child.data;
      return {
        id: post.id,
        title: post.title,
        author: {
          name: post.author,
          avatar: `https://ui-avatars.com/api/?name=${post.author}&background=random`
        },
        subreddit: post.subreddit,
        upvotes: post.ups,
        comments: post.num_comments,
        image: post.url_overridden_by_dest || (post.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&')) || null,
        createdAt: post.created_utc,
        url: `https://reddit.com${post.permalink}`,
        type: post.is_video ? 'video' : 'image',
        isVideo: post.is_video,
        fallbackUrl: post.media?.reddit_video?.fallback_url || null,
        selftext: post.selftext
      };
    }).filter(post => !post.title.includes('Megathread'));

    const result = {
      posts,
      after: response.data.data.after
    };

    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Error fetching posts from r/${subreddit}:`, error.response?.data || error.message);
    const mockPosts = [
      {
        id: `mock-${Date.now()}`,
        title: `Welcome to the ${subreddit} community! (Offline Mode)`,
        author: {
          name: "FitCircle",
          avatar: `https://ui-avatars.com/api/?name=FitCircle&background=random`
        },
        subreddit: subreddit,
        upvotes: 125,
        comments: 12,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600",
        createdAt: Math.floor(Date.now() / 1000),
        url: "#",
        type: "image",
        isVideo: false,
        fallbackUrl: null,
        selftext: "Reddit API limit reached. Showing offline content."
      },
      {
        id: `mock-${Date.now()}-2`,
        title: "Just hit a new PR on my deadlift! 405lbs for 3 reps!",
        author: {
          name: "IronLifter99",
          avatar: `https://ui-avatars.com/api/?name=IronLifter99&background=random`
        },
        subreddit: subreddit,
        upvotes: 342,
        comments: 45,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
        createdAt: Math.floor(Date.now() / 1000) - 3600,
        url: "#",
        type: "image",
        isVideo: false,
        fallbackUrl: null,
        selftext: "It took me 2 years of consistent training but I finally broke the 400lb barrier!"
      },
      {
        id: `mock-${Date.now()}-3`,
        title: "What are your favorite high-protein vegetarian meals?",
        author: {
          name: "HealthyEats",
          avatar: `https://ui-avatars.com/api/?name=HealthyEats&background=random`
        },
        subreddit: subreddit,
        upvotes: 89,
        comments: 112,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600",
        createdAt: Math.floor(Date.now() / 1000) - 7200,
        url: "#",
        type: "image",
        isVideo: false,
        fallbackUrl: null,
        selftext: "I'm trying to hit 150g of protein a day without meat. Any suggestions?"
      },
      {
        id: `mock-${Date.now()}-4`,
        title: "Form check on my squats? Feeling some lower back pain.",
        author: {
          name: "NewbieGains",
          avatar: `https://ui-avatars.com/api/?name=NewbieGains&background=random`
        },
        subreddit: subreddit,
        upvotes: 56,
        comments: 34,
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600",
        createdAt: Math.floor(Date.now() / 1000) - 86400,
        url: "#",
        type: "image",
        isVideo: false,
        fallbackUrl: null,
        selftext: "I think my hips are rising too fast, but I'd love some expert eyes on this."
      },
      {
        id: `mock-${Date.now()}-5`,
        title: "Just completed my first 5K without stopping!",
        author: {
          name: "RunnerGirl",
          avatar: `https://ui-avatars.com/api/?name=RunnerGirl&background=random`
        },
        subreddit: subreddit,
        upvotes: 892,
        comments: 145,
        image: "https://images.unsplash.com/photo-1552674605-1715241d1851?auto=format&fit=crop&q=80&w=600",
        createdAt: Math.floor(Date.now() / 1000) - 120000,
        url: "#",
        type: "image",
        isVideo: false,
        fallbackUrl: null,
        selftext: "I started Couch to 5K three months ago and today I finally ran the whole way!"
      },
      {
        id: `mock-${Date.now()}-6`,
        title: "Meal prep Sunday: 10 meals, 500 calories each, 45g protein.",
        author: {
          name: "PrepMaster",
          avatar: `https://ui-avatars.com/api/?name=PrepMaster&background=random`
        },
        subreddit: subreddit,
        upvotes: 1245,
        comments: 320,
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600",
        createdAt: Math.floor(Date.now() / 1000) - 200000,
        url: "#",
        type: "image",
        isVideo: false,
        fallbackUrl: null,
        selftext: "Chicken breast, sweet potatoes, and roasted broccoli. Simple but effective."
      },
      {
        id: `mock-${Date.now()}-7`,
        title: "How do you stay motivated during the winter?",
        author: {
          name: "WinterBlues",
          avatar: `https://ui-avatars.com/api/?name=WinterBlues&background=random`
        },
        subreddit: subreddit,
        upvotes: 430,
        comments: 210,
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600",
        createdAt: Math.floor(Date.now() / 1000) - 250000,
        url: "#",
        type: "image",
        isVideo: false,
        fallbackUrl: null,
        selftext: "It's cold and dark when I wake up, and cold and dark when I get off work. Help!"
      },
      {
        id: `mock-${Date.now()}-8`,
        title: "Transforming my garage into a home gym on a budget.",
        author: {
          name: "DIYLifter",
          avatar: `https://ui-avatars.com/api/?name=DIYLifter&background=random`
        },
        subreddit: subreddit,
        upvotes: 2100,
        comments: 450,
        image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600",
        createdAt: Math.floor(Date.now() / 1000) - 300000,
        url: "#",
        type: "image",
        isVideo: false,
        fallbackUrl: null,
        selftext: "Total cost: $450. I bought everything used off Facebook Marketplace."
      }
    ];
    return { posts: mockPosts, after: null };
  }
};

export const getNutritionPosts = async (limit = 20, after = '') => {
  return getFitnessPosts('nutrition', limit, after);
};

export const getWeightLossPosts = async (limit = 20, after = '') => {
  return getFitnessPosts('loseit', limit, after);
};

export const getMuscleGainPosts = async (limit = 20, after = '') => {
  return getFitnessPosts('gainit', limit, after);
};

export const getAllFeeds = async (limit = 20, after = '') => {
  return getFitnessPosts('Fitness+bodyweightfitness+loseit+nutrition+gainit+progresspics', limit, after);
};

export const getTrendingReels = async (limit = 20) => {
  const cacheKey = `trending_reels_${limit}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`https://www.reddit.com/r/progresspics+bodyweightfitness/hot.json?limit=${limit * 2}`, {
      headers: {
        'User-Agent': 'FitCirclePro/1.0.0 (by /u/fitcircle_admin)'
      },
      timeout: 10000
    });

    const posts = response.data.data.children
      .filter(child => child.data.url_overridden_by_dest && child.data.url_overridden_by_dest.match(/\.(jpeg|jpg|gif|png)$/i) || child.data.is_video)
      .map(child => {
        const post = child.data;
        return {
          id: post.id,
          title: post.title,
          author: {
            name: post.author,
            avatar: `https://ui-avatars.com/api/?name=${post.author}&background=random`
          },
          subreddit: post.subreddit,
          upvotes: post.ups,
          comments: post.num_comments,
          image: post.url_overridden_by_dest || (post.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&')),
          url: `https://reddit.com${post.permalink}`,
          isVideo: post.is_video,
          fallbackUrl: post.media?.reddit_video?.fallback_url || null,
        };
      })
      .slice(0, limit);

    cache.set(cacheKey, posts);
    return posts;
  } catch (error) {
    console.error(`Error fetching trending reels:`, error.message);
    return [];
  }
};
