import Post from "../models/Post.js";
import axios from 'axios';

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