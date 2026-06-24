import mongoose from "mongoose";

const feedCommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "FeedItem", required: true },
  userId: { type: String, required: true },
  userName: { type: String, default: "User" },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

feedCommentSchema.index({ postId: 1, createdAt: -1 });

const FeedComment = mongoose.model("FeedComment", feedCommentSchema);
export default FeedComment;
