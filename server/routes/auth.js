const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require("passport");

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email } = req.body;

  // check for required fields ug institutional email ba iya gamit
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ message: "Please fill in all fields" }); // mag error siya in postman
  }
  if (!/@(student\.)?buksu\.edu\.ph$/.test(email)) {
    return res.status(400).json({ message: "Invalid institutional email" }); // apil ni siya mu gawas as error
  }

  try {
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user
    const newUser = new User({ firstName, lastName, email });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" }); // dili siya specific na error, basta nag error ahhaha lol jk
  }
});

// google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

module.exports = router;
