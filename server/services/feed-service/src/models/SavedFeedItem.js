import mongoose from "mongoose";

const savedFeedItemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "FeedItem", required: true },
  createdAt: { type: Date, default: Date.now },
});

savedFeedItemSchema.index({ userId: 1, postId: 1 }, { unique: true });
savedFeedItemSchema.index({ userId: 1, createdAt: -1 });

const SavedFeedItem = mongoose.model("SavedFeedItem", savedFeedItemSchema);
export default SavedFeedItem;
