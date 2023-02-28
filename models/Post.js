import mongoose from "mongoose";

// DB Schema
const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      max: 250,
    },
    isPrivate: Boolean,
    date: { type: Date, default: Date.now },
    access: {
      type: Array,
      default: [],
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
