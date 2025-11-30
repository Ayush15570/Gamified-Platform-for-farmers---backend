import { User } from "../models/user.model.js";

export const verifyVIP = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.subscription !== "vip") {
      return res.status(403).json({ message: "VIP access required" });
    }

    next();
  } catch (error) {
    console.error("VIP middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
