const express = require("express");
const router = express.Router();
const LoginHistory = require("../models/LoginHistory");
const User = require("../models/User"); // import user model

// check the current number of gym members inside
router.get("/current-members", async (req, res) => {
  try {
    // get all login history entries where logoutTime is null
    const currentMembers = await LoginHistory.find({ logoutTime: null })
      .populate("userId", "firstName lastName email") // fill user details if needed
      .exec();

    // respond with the count and details of the current members
    res.status(200).json({
      count: currentMembers.length,
      members: currentMembers.map((entry) => ({
        userId: entry.userId._id,
        firstName: entry.userId.firstName,
        lastName: entry.userId.lastName,
        email: entry.userId.email,
        loginTime: entry.loginTime,
      })),
    });
  } catch (error) {
    console.error("Error fetching current members:", error);
    res.status(500).json({ message: "Error fetching current members" });
  }
});

// get the most recent signup
router.get("/recent-signup", async (req, res) => {
  try {
    // get the most recently created user
    const recentUser = await User.findOne()
      .sort({ createdAt: -1 }) // sort by the `createdAt` field in descending order
      .select("firstName lastName _id email createdAt") // select relevant fields
      .exec();

    if (!recentUser) {
      return res.status(404).json({ message: "No recent signups found." });
    }

    res.status(200).json({
      id: recentUser._id,
      name: `${recentUser.firstName} ${recentUser.lastName}`,
      email: recentUser.email,
      createdAt: recentUser.createdAt,
    });
  } catch (error) {
    console.error("Error fetching recent signup:", error);
    res.status(500).json({ message: "Error fetching recent signup" });
  }
});

module.exports = router;
