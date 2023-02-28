import mongoose from "mongoose";

// DB Schema
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 25,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
      max: 50,
    },
    bio: {
      type: String,
      default: "",
      max: 200,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    closeFriends: {
      type: Array,
      default: [],
    },
    totalLikes: {
      type: Number,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
