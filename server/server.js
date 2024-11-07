const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const webauthnRoutes = require("./routes/webauthn");
const nodemailer = require("nodemailer");
const cors = require("cors");

dotenv.config(); // load environment variables
require("./config/passport"); // load passport configuration

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // allow frontend requests

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
  isActive: { type: Boolean, default: true }, // Track active status
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

// function to send passkey link via email
const sendPasskeyLink = async (email) => {
  const mailOptions = {
    from: `BukSU Fitness Gym <${process.env.EMAIL_SENDER}>`,
    to: email,
    subject: "Create Your Passkey",
    text: "Maayad ha aldaw! Your eligibility has been verified and now you can activate your Login Passkey! You are 1 step closer in achieving your ideal you! Click on the link to activate your Passkey.  http://localhost:3000/create-passkey",
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Passkey creation link sent to:", email);
  } catch (error) {
    console.error("Error sending email:", error.response || error.message);
    throw error;
  }
};

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

// route to send a test email (for debugging)
app.post("/test-email", async (req, res) => {
  const { email } = req.body;

  try {
    await sendPasskeyLink(email);
    res.status(200).send("Test email sent successfully.");
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).send("Error sending test email.");
  }
});

// route to send passkey link in "production" lmaoo
app.post("/send-passkey-link", async (req, res) => {
  try {
    const { email } = req.body;
    const mailOptions = {
      from: `BukSU Fitness Gym <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: "Create Your Passkey",
      text: "Maayad ha aldaw! Your eligibility has been verified and now you can activate your Login Passkey! You are 1 step closer in achieving your ideal you! Click on the link to activate your Passkey.  http://localhost:3000/create-passkey",
    };

    // use the transporter to send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send("Passkey creation link sent to the user!");
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).send("Error sending email");
  }
});

// route
app.use("/auth", authRoutes);
app.use("/webauthn", webauthnRoutes); // Use WebAuthn routes

// server listening on..
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// i hate captialism (letters) >:(
