const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bcrypt = require("bcrypt");

dotenv.config(); // load environment variables
require("./config/passport"); // load passport configuration

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
    credentials: true,
  })
);

// setup session (needed for Passport sessions)
app.use(
  session({ secret: "your-secret", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// user schema and model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: { type: String, required: true },
  isActive: { type: Boolean, default: false }, // track active status
});

// avoid re-registering the User model if it already exists
const User = mongoose.models.User || mongoose.model("User", userSchema);

// initialize transporter for email sending
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.APP_PASSWORD,
  },
});

// route to activate a user
app.put("/users/activate", async (req, res) => {
  const { email } = req.body;
  try {
    const activatedUser = await User.findOneAndUpdate(
      { email },
      { isActive: true },
      { new: true }
    );

    if (!activatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User activated", user: activatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error activating user" });
  }
});

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword, // hashed password
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// route to send success email
app.post("/send-success-email", async (req, res) => {
  const { email } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: "Welcome to the BukSU Fitness Gym!",
      text: "Maayad ha aldaw! Your account has been successfully activated. You can now access the gym facilities.",
    });
    res.status(200).json({ message: "" });
  } catch (err) {
    res.status(500).json({ message: "Error sending success email" });
  }
});

// route to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving users" });
  }
});

// route to update user’s first or last name
app.put("/users/update-name", async (req, res) => {
  const { email, firstName, lastName } = req.body;
  try {
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    const updatedUser = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// route to archive (deactivate) a user
app.put("/users/archive", async (req, res) => {
  const { email } = req.body;
  try {
    const archivedUser = await User.findOneAndUpdate(
      { email },
      { isActive: false },
      { new: true }
    );

    if (!archivedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User archived", user: archivedUser });
  } catch (err) {
    res.status(500).json({ message: "Error archiving user" });
  }
});

// route
app.use("/auth", authRoutes);

// server listening on..
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// i hate captialism (letters) >:(
