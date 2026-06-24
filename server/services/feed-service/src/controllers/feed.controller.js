import Post from "../models/Post.js";
import axios from 'axios';
import Reel from "../models/Reel.js";
import Story from "../models/Story.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import * as redditService from "../services/redditService.js";
import FeedItem from "../models/FeedItem.js";
import FeedLike from "../models/FeedLike.js";
import FeedComment from "../models/FeedComment.js";
import FeedShare from "../models/FeedShare.js";
import SavedFeedItem from "../models/SavedFeedItem.js";

const generateUniqueKey = (source, url, title) => {
  const raw = `${source}-${url || title}`;
  return crypto.createHash("md5").update(raw).digest("hex");
};

export const getReels = async (req, res) => {
  try {
    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
    const query = req.query.q || "fitness workout";
    const page = req.query.page || 1;
    const per_page = req.query.per_page || 10;

    // Fallback local Mock vertical video data (real working vertical mp4 streams)
    const fallbackVideos = [
      {
        id: "mock-1",
        video_file: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227189f7f02d4f29a008c2a955c479&profile_id=139&oauth2_token_id=57447761",
        videoThumb: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=700&fit=crop",
        thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=700&fit=crop",
        user: "Sachin Gokhale",
        author: { name: "Sachin Gokhale", avatar: "https://i.pravatar.cc/80?u=sachin" },
        description: "Pushing limits on the clean and jerk today! 🏋️ #strength #fitnessjourney",
        music: "Hardwell - Spaceman (Workout Remix)"
      },
      {
        id: "mock-2",
        video_file: "https://player.vimeo.com/external/435674703.sd.mp4?s=7fdf705fa93297a7833a4bf92a5482390f772714&profile_id=139&oauth2_token_id=57447761",
        videoThumb: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=700&fit=crop",
        thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=700&fit=crop",
        user: "Radhika Bose",
        author: { name: "Radhika Bose", avatar: "https://i.pravatar.cc/80?u=radhika" },
        description: "Core strength is core power. Try this routine! 🔥 #abs #pilates",
        music: "A.R. Rahman - Jai Ho (Instrumental)"
      },
      {
        id: "mock-3",
        video_file: "https://player.vimeo.com/external/430263659.sd.mp4?s=dcf69074092b3c2999718f4a7c88b776a3ff81b9&profile_id=139&oauth2_token_id=57447761",
        videoThumb: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=700&fit=crop",
        thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=700&fit=crop",
        user: "Yash Anand",
        author: { name: "Yash Anand", avatar: "https://i.pravatar.cc/80?u=yash" },
        description: "Squat form check. Deep and explosive. 🏋️‍♂️ #legday #heavy",
        music: "Linkin Park - In The End (Mellen Gi Remix)"
      },
      {
        id: "mock-4",
        video_file: "https://player.vimeo.com/external/435674690.sd.mp4?s=12a951d8db5465e90d8108be6031201eb509a25b&profile_id=139&oauth2_token_id=57447761",
        videoThumb: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=700&fit=crop",
        thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=700&fit=crop",
        user: "Guru Mann",
        author: { name: "Guru Mann", avatar: "https://i.pravatar.cc/80?u=guru" },
        description: "Active coaching session. Correct posture avoids injury. #training #tips",
        music: "Sidhu Moose Wala - The Last Ride"
      },
      {
        id: "mock-5",
        video_file: "https://player.vimeo.com/external/517618037.sd.mp4?s=f5b9d363b7e776e07af4fb5d7c57b778a4fe0f1f&profile_id=139&oauth2_token_id=57447761",
        videoThumb: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=700&fit=crop",
        thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=700&fit=crop",
        user: "Sneha K.",
        author: { name: "Sneha K.", avatar: "https://i.pravatar.cc/80?u=sneha" },
        description: "Morning running sprints. Speed & endurance training 🏃‍♀️ #cardio #track",
        music: "The Weeknd - Blinding Lights"
      }
    ];

    if (PEXELS_API_KEY) {
      const response = await axios.get("https://api.pexels.com/videos/search", {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
        params: {
          query: query,
          orientation: "portrait",
          size: "medium",
          page: page,
          per_page: per_page,
        },
      });

      // Get DB data for the returned videos
      const pexelsIds = response.data.videos.map((video) => String(video.id));
      const dbReels = await Reel.find({ pexelsId: { $in: pexelsIds } });
      const dbReelsMap = dbReels.reduce((acc, r) => {
        acc[r.pexelsId] = r;
        return acc;
      }, {});

      // Parse authorization token optional
      let currentUserId = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          currentUserId = decoded.id;
        } catch (err) {
          // ignore
        }
      }

      const reelsVideos = response.data.videos.map((video) => {
        const videoFiles = video.video_files.find(
          (file) => file.quality === "sd" && file.width <= 720
        ) || video.video_files.find(
          (file) => file.quality === "hd" && file.width <= 1080
        ) || video.video_files[0];

        const dbReel = dbReelsMap[String(video.id)];
        const likesCount = dbReel ? dbReel.likes.length : 0;
        const comments = dbReel ? dbReel.comments : [];
        const liked = currentUserId && dbReel ? dbReel.likes.includes(currentUserId) : false;

        const mins = Math.floor((video.duration || 30) / 60);
        const secs = Math.floor((video.duration || 30) % 60);

        return {
          id: video.id,
          video_file: videoFiles ? videoFiles.link : null,
          videoThumb: video.image,
          thumbnail: video.image,
          user: video.user.name,
          duration: `${mins}:${secs.toString().padStart(2, '0')}`,
          author: {
            name: video.user.name,
            avatar: `https://i.pravatar.cc/80?u=${video.user.id || video.id}`,
          },
          description: `Workout inspiration by ${video.user.name} #fitness #fitcircle`,
          likes: likesCount,
          likesCount: likesCount,
          liked: liked,
          comments: comments,
          commentsCount: comments.length,
          music: `Original Audio - ${video.user.name}`,
        };
      }).filter((video) => video.video_file !== null);

      return res.json({ videos: reelsVideos });
    } else {
      // Mock data local DB loading
      const pexelsIds = fallbackVideos.map((video) => String(video.id));
      const dbReels = await Reel.find({ pexelsId: { $in: pexelsIds } });
      const dbReelsMap = dbReels.reduce((acc, r) => {
        acc[r.pexelsId] = r;
        return acc;
      }, {});

      // Parse authorization token optional
      let currentUserId = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          currentUserId = decoded.id;
        } catch (err) {
          // ignore
        }
      }

      const enrichedFallback = fallbackVideos.map(video => {
        const dbReel = dbReelsMap[String(video.id)];
        const likesCount = dbReel ? dbReel.likes.length : 0;
        const comments = dbReel ? dbReel.comments : [];
        const liked = currentUserId && dbReel ? dbReel.likes.includes(currentUserId) : false;

        return {
          ...video,
          likes: likesCount,
          likesCount: likesCount,
          liked: liked,
          comments: comments,
          commentsCount: comments.length,
        };
      });

      return res.json({ videos: enrichedFallback });
    }
  } catch (error) {
    console.error("Error fetching reels:", error.message);
    res.status(500).json({ message: "Failed to fetch reels videos" });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found ❌" });
    }

    post.comments.push({
      userId,
      text,
    });

    await post.save();

    res.json({
      message: "Comment added ✅",
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment ❌" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found ❌" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // UNLIKE
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // LIKE
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling like ❌" });
  }
};

// create post
export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    const media = req.file?.path;

    const post = await Post.create({
      userId: req.user.id,
      caption,
      media,
    });

    res.status(201).json({
      message: "Post created ✅",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating post ❌" });
  }
};


export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        try {
          const userRes = await axios.get(
            `http://localhost:5002/api/users/${post.userId}`
          );

          return {
            ...post.toObject(),
            user: userRes.data,
          };
        } catch (err) {
          return {
            ...post.toObject(),
            user: null,
          };
        }
      })
    );

    res.json(enrichedPosts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts ❌" });
  }
};

export const toggleReelLike = async (req, res) => {
  try {
    const { reelId } = req.params;
    const userId = req.user.id; // From protect middleware

    let reel = await Reel.findOne({ pexelsId: reelId });
    if (!reel) {
      reel = new Reel({ pexelsId: reelId, likes: [], comments: [] });
    }

    const likeIndex = reel.likes.indexOf(userId);
    let liked = false;
    if (likeIndex > -1) {
      reel.likes.splice(likeIndex, 1);
    } else {
      reel.likes.push(userId);
      liked = true;
    }

    await reel.save();
    res.json({ message: liked ? "Reel liked" : "Reel unliked", liked, likesCount: reel.likes.length });
  } catch (error) {
    console.error("Error toggling reel like:", error);
    res.status(500).json({ message: "Error toggling reel like" });
  }
};

export const addReelComment = async (req, res) => {
  try {
    const { reelId } = req.params;
    const userId = req.user.id; // From protect middleware
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    let reel = await Reel.findOne({ pexelsId: reelId });
    if (!reel) {
      reel = new Reel({ pexelsId: reelId, likes: [], comments: [] });
    }

    const userName = req.user.name || req.user.email?.split("@")[0] || "User";

    const newComment = {
      userId,
      userName,
      text,
      createdAt: new Date()
    };

    reel.comments.push(newComment);
    await reel.save();

    res.status(201).json({ message: "Comment added successfully", comment: newComment, comments: reel.comments });
  } catch (error) {
    console.error("Error adding reel comment:", error);
    res.status(500).json({ message: "Error adding reel comment" });
  }
};

export const getReelComments = async (req, res) => {
  try {
    const { reelId } = req.params;
    const reel = await Reel.findOne({ pexelsId: reelId });
    if (!reel) {
      return res.json({ comments: [] });
    }
    res.json({ comments: reel.comments });
  } catch (error) {
    console.error("Error fetching reel comments:", error);
    res.status(500).json({ message: "Error fetching reel comments" });
  }
};

export const addStoryComment = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    let story = await Story.findOne({ storyId });
    if (!story) {
      story = new Story({ storyId, comments: [] });
    }

    const userName = req.user.name || req.user.email?.split("@")[0] || "User";

    const newComment = {
      userId,
      userName,
      text,
      createdAt: new Date()
    };

    story.comments.push(newComment);
    await story.save();

    res.status(201).json({ message: "Story comment added successfully", comment: newComment, comments: story.comments });
  } catch (error) {
    console.error("Error adding story comment:", error);
    res.status(500).json({ message: "Error adding story comment" });
  }
};

export const getStoryComments = async (req, res) => {
  try {
    const { storyId } = req.params;
    const story = await Story.findOne({ storyId });
    if (!story) {
      return res.json({ comments: [] });
    }
    res.json({ comments: story.comments });
  } catch (error) {
    console.error("Error fetching story comments:", error);
    res.status(500).json({ message: "Error fetching story comments" });
  }
};

import { getDynamicFeed } from "../services/feedAggregator.service.js";

export const getRedditPosts = async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;
    const result = await getDynamicFeed(category, limit);

    let currentUserId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        currentUserId = decoded.id;
      } catch (_) {}
    }

    const posts = await Promise.all(result.posts.map(async (item) => {
      const uniqueKey = generateUniqueKey(item.source, item.url, item.title);

      let feedItem = await FeedItem.findOne({ uniqueKey });
      if (!feedItem) {
        feedItem = await FeedItem.create({
          uniqueKey,
          sourceType: item.source,
          originalId: item.id,
          title: item.title,
          description: item.summary,
          image: item.image,
          url: item.url || "#",
          category: item.category || "Fitness",
          author: {
            name: item.author?.name || "FitCircle",
            avatar: item.author?.avatar || "https://ui-avatars.com/api/?name=User&background=random",
          },
          publishedAt: item.publishedAt,
          isVideo: item.isVideo || false,
          fallbackUrl: item.fallbackUrl,
        });
      }

      const realLikes = await FeedLike.countDocuments({ postId: feedItem._id });
      const realComments = await FeedComment.countDocuments({ postId: feedItem._id });
      const realShares = await FeedShare.countDocuments({ postId: feedItem._id });

      let liked = false;
      let saved = false;
      if (currentUserId) {
        const existingLike = await FeedLike.findOne({ postId: feedItem._id, userId: currentUserId });
        liked = !!existingLike;
        const existingSave = await SavedFeedItem.findOne({ userId: currentUserId, postId: feedItem._id });
        saved = !!existingSave;
      }

      if (realLikes > 0 || realComments > 0 || realShares > 0) {
        await FeedItem.updateOne({ _id: feedItem._id }, {
          $set: { likeCount: realLikes, commentCount: realComments, shareCount: realShares },
        });
      }

      const displayLikes = realLikes > 0 ? realLikes : (item.engagement?.likes || 0);
      const displayComments = realComments > 0 ? realComments : (item.engagement?.comments || 0);

      return {
        _id: feedItem._id.toString(),
        id: feedItem._id.toString(),
        title: item.title,
        author: item.author,
        subreddit: item.category || "Fitness",
        upvotes: displayLikes,
        comments: displayComments,
        image: item.image,
        createdAt: item.publishedAt,
        url: item.url,
        isVideo: item.isVideo,
        fallbackUrl: item.fallbackUrl,
        selftext: item.summary,
        source: item.source,
        liked,
        saved,
      };
    }));

    res.json({ posts, after: null });
  } catch (error) {
    console.error("getRedditPosts error:", error);
    res.status(500).json({ error: 'Failed to fetch dynamic feed data' });
  }
};

import { getTrending } from "../services/tavily.service.js";

export const getTrendingTopics = async (req, res) => {
  try {
    const topics = await getTrending();
    res.json({ topics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending topics' });
  }
};

export const getDiscoverFeed = async (req, res) => {
  try {
    const { limit = 20, after = '' } = req.query;
    const result = await redditService.getAllFeeds(limit, after);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch discover feed' });
  }
};

// ─── Feed Item Interactions ─────────────────────────────────────────────

export const likeFeedPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const feedItem = await FeedItem.findById(id);
    if (!feedItem) return res.status(404).json({ message: "Post not found" });

    const existing = await FeedLike.findOne({ postId: id, userId });
    if (existing) return res.json({ liked: true, likesCount: await FeedLike.countDocuments({ postId: id }) });

    await FeedLike.create({ postId: id, userId });
    const likesCount = await FeedLike.countDocuments({ postId: id });
    await FeedItem.updateOne({ _id: id }, { $set: { likeCount: likesCount } });

    res.json({ liked: true, likesCount });
  } catch (error) {
    console.error("likeFeedPost error:", error);
    res.status(500).json({ message: "Error liking post" });
  }
};

export const unlikeFeedPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await FeedLike.deleteOne({ postId: id, userId });
    const likesCount = await FeedLike.countDocuments({ postId: id });
    await FeedItem.updateOne({ _id: id }, { $set: { likeCount: likesCount } });

    res.json({ liked: false, likesCount });
  } catch (error) {
    console.error("unlikeFeedPost error:", error);
    res.status(500).json({ message: "Error unliking post" });
  }
};

export const getFeedComments = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comments = await FeedComment.find({ postId: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await FeedComment.countDocuments({ postId: id });

    res.json({ comments, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("getFeedComments error:", error);
    res.status(500).json({ message: "Error fetching comments" });
  }
};

export const addFeedComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userName = req.user.name || req.user.email?.split("@")[0] || "User";
    const { text } = req.body;

    if (!text || !text.trim()) return res.status(400).json({ message: "Comment text is required" });

    const feedItem = await FeedItem.findById(id);
    if (!feedItem) return res.status(404).json({ message: "Post not found" });

    const comment = await FeedComment.create({ postId: id, userId, userName, text: text.trim() });
    const commentCount = await FeedComment.countDocuments({ postId: id });
    await FeedItem.updateOne({ _id: id }, { $set: { commentCount } });

    res.status(201).json({ comment, commentCount });
  } catch (error) {
    console.error("addFeedComment error:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
};

export const shareFeedPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const feedItem = await FeedItem.findById(id);
    if (!feedItem) return res.status(404).json({ message: "Post not found" });

    await FeedShare.create({ postId: id, userId });
    const shareCount = await FeedShare.countDocuments({ postId: id });
    await FeedItem.updateOne({ _id: id }, { $set: { shareCount } });

    res.json({ shared: true, shareCount });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ shared: true, shareCount: await FeedShare.countDocuments({ postId: id }) });
    }
    console.error("shareFeedPost error:", error);
    res.status(500).json({ message: "Error sharing post" });
  }
};

export const saveFeedPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const feedItem = await FeedItem.findById(id);
    if (!feedItem) return res.status(404).json({ message: "Post not found" });

    const existing = await SavedFeedItem.findOne({ userId, postId: id });
    if (existing) return res.json({ saved: true });

    await SavedFeedItem.create({ userId, postId: id });
    res.json({ saved: true });
  } catch (error) {
    if (error.code === 11000) return res.json({ saved: true });
    console.error("saveFeedPost error:", error);
    res.status(500).json({ message: "Error saving post" });
  }
};

export const unsaveFeedPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await SavedFeedItem.deleteOne({ userId, postId: id });
    res.json({ saved: false });
  } catch (error) {
    console.error("unsaveFeedPost error:", error);
    res.status(500).json({ message: "Error unsaving post" });
  }
};

export const getSavedFeedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const saved = await SavedFeedItem.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("postId")
      .lean();

    const total = await SavedFeedItem.countDocuments({ userId });

    const posts = saved.filter(s => s.postId).map(s => ({
      _id: s.postId._id.toString(),
      id: s.postId._id.toString(),
      title: s.postId.title,
      image: s.postId.image,
      url: s.postId.url,
      source: s.postId.sourceType,
      description: s.postId.description,
      savedAt: s.createdAt,
    }));

    res.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("getSavedFeedPosts error:", error);
    res.status(500).json({ message: "Error fetching saved posts" });
  }
};