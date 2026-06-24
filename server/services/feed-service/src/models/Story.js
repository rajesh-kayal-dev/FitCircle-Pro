import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userName: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const storySchema = new mongoose.Schema(
  {
    storyId: {
      type: String,
      required: true,
      unique: true,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);

export default Story;
