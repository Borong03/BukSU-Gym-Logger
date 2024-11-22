const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const router = express.Router();

dotenv.config();

// validate environment variables
if (!process.env.EMAIL_SENDER || !process.env.APP_PASSWORD) {
  console.error("Missing EMAIL_SENDER or APP_PASSWORD in .env file.");
  process.exit(1); // Exit with failure
}

// create transporter for email sending
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.APP_PASSWORD,
  },
});

// utility function to send emails
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Error sending email to ${to}:`, err.message);
    throw err;
  }
};

// route to send success email
router.post("/send-success-email", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email address is required" });
  }

  try {
    await sendEmail(
      email,
      "Welcome to the BukSU Fitness Gym!",
      "Maayad ha aldaw! Your account has been successfully activated. You can now access the gym facilities."
    );
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error sending success email",
      error: err.message,
    });
  }
});

console.log("Email:", process.env.EMAIL_SENDER);

module.exports = router;
