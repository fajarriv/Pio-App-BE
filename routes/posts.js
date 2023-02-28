import express from "express";
import { verifyToken } from "../controllers/auth.js";
import {
  getFeed,
  createPost,
  deletePost,
  updatePost,
  likePost,
} from "../controllers/posts.js";
const router = express.Router();

router.get("/:id", verifyToken, getFeed);

router.post("/create", verifyToken, createPost);

router.patch("/:id/update",verifyToken, updatePost)
router.patch("/:id/like",verifyToken, likePost)

router.delete("/:id",verifyToken,deletePost)
export default router;
