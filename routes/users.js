import express from "express"
import { verifyToken } from "../controllers/auth.js";
import {
    getUser,
    getCloseFriends,
    addRemoveCF,
    updateProfile,
    getAllUser,
  } from "../controllers/users.js";
const router = express.Router();


// get
router.get("/:id", verifyToken, getUser);
router.get("/:id/closeFriends", verifyToken, getCloseFriends);
router.get("/all/:id", verifyToken, getAllUser);

// Update profile
router.patch("/:id/update", verifyToken, updateProfile);

// Update Close Friends
router.patch("/:id/:friendId", verifyToken, addRemoveCF);


export default router;
