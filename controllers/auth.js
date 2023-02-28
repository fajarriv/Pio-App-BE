import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register
export const register = async (req, res) => {
  try {
    // destructuring req.body
    const { userName, password, bio, profilePicture } = req.body;

     //generate Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create user
    const newUser = new User({
      userName,
      password: hashedPassword,
      bio,
      profilePicture,
      closeFriends: [],
      totalLikes: 0,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
  
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return res.status(400).json({ msg: "Username not found" });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ msg: "Wrong Password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// JWT verifier
export const verifyToken = async (req, res, next) => {
    try {
      let token = req.header("Authorization");
  
      if (!token) {
        return res.status(403).send("User not logged in");
      }
  
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
      }
  
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  };
  