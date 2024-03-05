import User from "../models/user.model.js";

export const getUserForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const fitereUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(fitereUsers);

  } catch (error) {
    console.error("Error in getUserForSideBar: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
