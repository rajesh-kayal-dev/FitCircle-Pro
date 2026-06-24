import mongoose from "mongoose";

const feedLikeSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "FeedItem", required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

feedLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });
feedLikeSchema.index({ userId: 1 });

const FeedLike = mongoose.model("FeedLike", feedLikeSchema);
export default FeedLike;
