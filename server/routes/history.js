const express = require("express");
const router = express.Router();
const LoginHistory = require("../models/LoginHistory");

router.get("/history", async (req, res) => {
  const userId = req.query.userId; // get userId from query parameter

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // get user's login history
    const history = await LoginHistory.find({ userId }).sort({ loginTime: -1 }); // Sort by login time, most recent first

    if (history.length === 0) {
      return res
        .status(404)
        .json({ message: "No visit history found for this user" });
    }

    // return the visit history
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching visit history" });
  }
});

// get visit history based on userId
router.get("/history/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // query the LoginHistory model for the user's visit history
    const history = await LoginHistory.find({ userId })
      .sort({ loginTime: -1 }) // sort by login time, most recent first
      .select("loginTime logoutTime");

    // if no history found return an empty array
    if (!history) {
      return res
        .status(404)
        .json({ message: "No visit history found for this user." });
    }

    // send the visit history back
    res.status(200).json({ history });
  } catch (error) {
    console.error("Error fetching visit history:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching visit history." });
  }
});

// Leaderboard route
router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await LoginHistory.aggregate([
      // Calculate session duration for each record
      {
        $project: {
          userId: 1,
          sessionDuration: {
            $cond: {
              if: { $and: ["$loginTime", "$logoutTime"] },
              then: { $subtract: ["$logoutTime", "$loginTime"] },
              else: 0,
            },
          },
        },
      },
      // Group by userId and sum session durations
      {
        $group: {
          _id: "$userId",
          totalTime: { $sum: "$sessionDuration" },
        },
      },
      // Sort by total time in descending order and limit to top 5
      { $sort: { totalTime: -1 } },
      { $limit: 5 },
      // Lookup user information from the 'users' collection
      {
        $lookup: {
          from: "users", // Ensure this matches your users collection name
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      // Unwind the user array to extract fields
      { $unwind: "$user" },
      // Project only the necessary fields
      {
        $project: {
          firstName: "$user.firstName",
          totalTime: 1,
        },
      },
    ]);

    // Convert totalTime to HH:MM format
    const formattedLeaderboard = leaderboard.map((entry) => {
      const totalMinutes = Math.floor(entry.totalTime / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return {
        firstName: entry.firstName,
        totalTime: `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`,
      };
    });

    res.status(200).json(formattedLeaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching leaderboard." });
  }
});

module.exports = router;
