import mongoose from "mongoose";

const feedItemSchema = new mongoose.Schema({
  uniqueKey: { type: String, required: true, unique: true },
  sourceType: { type: String, enum: ["YouTube", "Tavily", "ExerciseDB"], required: true },
  originalId: String,
  title: { type: String, required: true },
  description: String,
  image: String,
  url: { type: String, default: "#" },
  category: String,
  author: {
    name: String,
    avatar: String,
  },
  publishedAt: Number,
  isVideo: { type: Boolean, default: false },
  fallbackUrl: String,
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  shareCount: { type: Number, default: 0 },
}, { timestamps: true });

feedItemSchema.index({ sourceType: 1, createdAt: -1 });
feedItemSchema.index({ category: 1 });

const FeedItem = mongoose.model("FeedItem", feedItemSchema);
export default FeedItem;
