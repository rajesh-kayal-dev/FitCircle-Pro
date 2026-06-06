import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    caption: String,
    media: String,
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    comments: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;