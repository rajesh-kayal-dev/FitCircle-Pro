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

const reelSchema = new mongoose.Schema(
  {
    pexelsId: {
      type: String,
      required: true,
      unique: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Reel = mongoose.model("Reel", reelSchema);

export default Reel;
