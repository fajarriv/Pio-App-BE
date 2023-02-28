import User from "../models/User.js";

// get user data
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// get all user
export const getAllUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const users = await User.find();
    const nonCF = await Promise.all(
      users.filter((x) => !currentUser.closeFriends.includes(x._id))
    );
    const formattedUsers = nonCF.map(({ _id, userName, profilePicture }) => {
      return { _id, userName, profilePicture };
    });
    res.status(200).json(formattedUsers);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// get current close friends
export const getCloseFriends = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const currentCF = await Promise.all(
      currentUser.closeFriends.map((id) => User.findById(id))
    );
    const formattedCF = currentCF.map(({ _id, userName, profilePicture }) => {
      return { _id, userName, profilePicture };
    });

    res.status(200).json(formattedCF);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// update userdata
export const updateProfile = async (req, res) => {
  try {
    if (req.body.bio || req.body.profilePicture) {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: { bio: req.body.bio, profilePicture: req.body.profilePicture },
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

// update close friends
export const addRemoveCF = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const currentUser = await User.findById(id);

    if (currentUser.closeFriends.includes(friendId)) {
      // remove from closeFriends
      currentUser.closeFriends = currentUser.closeFriends.filter(
        (id) => id !== friendId
      );
    } else {
      // Add to CF
      currentUser.closeFriends.push(friendId);
    }
    await currentUser.save();
    // find all user object from CF
    const currentCF = await Promise.all(
      currentUser.closeFriends.map((id) => User.findById(id))
    );
    const formattedCF = currentCF.map(({ _id, userName, profilePicture }) => {
      return { _id, userName, profilePicture };
    });
    res.status(200).json(formattedCF);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
