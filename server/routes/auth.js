const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");

// Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to send passkey email
router.post("/send-passkey-email", async (req, res) => {
  const { email } = req.body;

  const link = `http://localhost:3000/create-passkey/${email}`; // Link to create passkey

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Create Your Passkey",
    text: `Click on the following link to create your passkey: ${link}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email" });
  }
});

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

// trigger Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google oauth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // successful authentication, redirect to dash
    res.redirect("/dashboard");
  }
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// route to search user by email with partial matching
router.get("/search", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Use a regular expression for partial email matching
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
