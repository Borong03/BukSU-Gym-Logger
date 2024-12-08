const express = require("express");
const router = express.Router();
const LoginHistory = require("../models/LoginHistory");

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

module.exports = router;
