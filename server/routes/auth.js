const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "4ureyes0nly";
const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// login auth
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });
    if (!user.isActive) return res.status(403).json({ message: "User account is not active" });

    // Generate a token
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, jwtSecret, { expiresIn: "1h" });

    // Respond with token, admin status, and first name
    res.status(200).json({
      message: "Login successful",
      token,
      isAdmin: user.isAdmin,
      firstName: user.firstName, // Include first name here
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // check for required fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  if (!/@(student\.)?buksu\.edu\.ph$/.test(email)) {
    return res.status(400).json({ message: "Invalid institutional email" });
  }

  try {
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user with hashed password
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// trigger Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google oauth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // redirect to the frontend with the user's first name
    res.redirect(`http://localhost:3000/dash?name=${req.user.firstName}`);
  }
);

// route to search user by email with partial matching
router.get("/search", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // use regular expression for partial email matching
    const user = await User.findOne({
      email: { $regex: email, $options: "i" },
    });
    if (user) {
      res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error searching for user" });
  }
});

module.exports = router;
