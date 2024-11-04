const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const cors = require("cors"); // added CORS
dotenv.config(); // load .env
require("./config/passport"); // load passport config

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // allow frontend requests

// setup session (needed for passport sessions)
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

// routes
app.use("/auth", authRoutes);

// server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
