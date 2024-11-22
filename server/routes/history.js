const express = require('express');
const router = express.Router();
const LoginHistory = require('../models/LoginHistory');

router.get("/history", async (req, res) => {
    const userId = req.query.userId; // get userId from query parameter
  
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
  
    try {
      // get user's login history
      const history = await LoginHistory.find({ userId }).sort({ loginTime: -1 }); // Sort by login time, most recent first
  
      if (history.length === 0) {
        return res.status(404).json({ message: "No visit history found for this user" });
      }
  
      // return the visit history
      res.status(200).json(history);
    } catch (error) {
      console.error("Error fetching history:", error);
      res.status(500).json({ message: "An error occurred while fetching visit history" });
    }
  });

// get visit history based on userId
router.get('/history/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // query the LoginHistory model for the user's visit history
    const history = await LoginHistory.find({ userId })
      .sort({ loginTime: -1 }) // sort by login time, most recent first
      .select('loginTime logoutTime');

    // if no history found return an empty array
    if (!history) {
      return res.status(404).json({ message: "No visit history found for this user." });
    }

    // send the visit history back
    res.status(200).json({ history });
  } catch (error) {
    console.error("Error fetching visit history:", error);
    res.status(500).json({ message: "An error occurred while fetching visit history." });
  }
});

module.exports = router;
