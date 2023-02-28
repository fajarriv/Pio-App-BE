import Post from "../models/Post.js";
import User from "../models/User.js";

// Create Post
export const createPost = async (req, res) => {
  try {
    const { authorId, description, isPrivate } = req.body;
    const author = await User.findById(authorId);
    if (isPrivate) {
      const newPost = new Post({
        authorId,
        description,
        isPrivate,
        access: author.closeFriends,
      });
      await newPost.save();
    } else {

      const newPost = new Post({
        authorId,
        description,
        isPrivate,
      });
      await newPost.save();
    }
    const post = await Post.find({ isPrivate: false });

    const friendsPost = await Post.find({ access: author._id });
    res.status(200).json(post.concat(...friendsPost));
  } catch (err) {
    res.status(500).json(err);
  }
};

// delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const author = await User.findById(post.authorId);
    if (post.authorId === req.body.currentUser) {
      await post.deleteOne();

      const newPost = await Post.find({ isPrivate: false });
      const friendsPost = await Post.find({ access: author._id });
      res.status(200).json(newPost.concat(...friendsPost));
    } else {
      res.status(403).json("Only can delete your own post");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.authorId === req.body.currentUser) {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { description: req.body.description },
        { new: true }
      );
      res.status(200).json(updatedPost);
    } else {
      res.status(403).json("Only can update your own post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// likePost
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const author = await User.findById(req.body.currentUser);
    if (!post.likes.includes(req.body.currentUser)) {
      await post.updateOne({ $push: { likes: req.body.currentUser } });
      await author.updateOne({ $inc: { totalLikes: 1 } });
      const updatedPost = await Post.findById(req.params.id);
      res.status(200).json(updatedPost);
    } else {
      await post.updateOne({ $pull: { likes: req.body.currentUser } });
      await author.updateOne({ $inc: { totalLikes: -1 } });
      const updatedPost = await Post.findById(req.params.id);
      res.status(200).json(updatedPost);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Home feed post
export const getFeed = async (req, res) => {
  try {
    // const currentUser = await User.findById(req.params.id);
    const post = await Post.find({ isPrivate: false });

    const friendsPost = await Post.find({ access: req.params.id });
    res.status(200).json(post.concat(...friendsPost));
  } catch (err) {
    res.status(404).json(err);
  }
};
