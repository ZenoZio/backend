import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }
    /// hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // https://avatar.iran.liara.run/public

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const grilProfilePic = `https://avatar.iran.liara.run/public/girld?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : grilProfilePic,
    });

    if (newUser) {
      // Generate JWT token hear
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in Signup controller", error.message);
    res.status(500).json({ error: "internal error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswrodCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswrodCorrect) {
      return res.status(400).json({ error: "Invalid password or username" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
    
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "internal error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", {maxAge: 0});
    res.status(200).json({message: "Logged Server successfully"})

  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "internal error" });
  }
};
