const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "4ureyes0nly";
const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const LoginHistory = require("../models/LoginHistory");

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

    // record login history
    const loginHistory = new LoginHistory({
      userId: user._id,
      ipAddress: req.ip,
      device: req.get("User-Agent"), // get device info
    });

    await loginHistory.save(); // save login history to the database

    // generate a token
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, jwtSecret, { expiresIn: "1h" });

    // respond with token, admin status, and first name
    res.status(200).json({
      message: "Login successful",
      token,
      isAdmin: user.isAdmin,
      firstName: user.firstName,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

// logout auth
router.post("/logout", async (req, res) => {
  const { userId } = req.body; // get userId from request body (importat)

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // search for the most recent login history entry for this user
    const lastLogin = await LoginHistory.findOne({ userId }).sort({ loginTime: -1 });

    if (!lastLogin) {
      return res.status(404).json({ message: "No login history found for this user" });
    }

    // update the logoutTime for the last login record
    lastLogin.logoutTime = new Date();
    await lastLogin.save();

    res.status(200).json({ message: "Logout time recorded successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "An error occurred during logout" });
  }
});

// signup auth
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
  async (req, res) => {
    // aafter successful authentication, record the login time

    const userId = req.user._id;

    try {
      // create new LoginHistory document to log the user's login time
      const newLoginHistory = new LoginHistory({
        userId: userId,
        loginTime: new Date(),
      });

      await newLoginHistory.save(); // save the login history to the database

      // redirect to the frontend with the user's first name and userId
      res.redirect(`http://localhost:3000/dash?name=${req.user.firstName}&userId=${req.user._id}`);
    } catch (error) {
      console.error("Error saving login history:", error);
      res.status(500).json({ message: "An error occurred while saving login history" });
    }
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
