import mongoose from "mongoose";

const feedShareSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "FeedItem", required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

feedShareSchema.index({ postId: 1, userId: 1 }, { unique: true });

const FeedShare = mongoose.model("FeedShare", feedShareSchema);
export default FeedShare;
