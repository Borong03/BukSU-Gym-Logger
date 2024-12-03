const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "4ureyes0nly";
const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcrypt");
const LoginHistory = require("../models/LoginHistory");

const checkLoginDuration = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const lastLogin = await LoginHistory.findOne({
      userId,
      logoutTime: null,
    }).sort({ loginTime: -1 });

    if (lastLogin) {
      const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
      if (lastLogin.loginTime < fiveHoursAgo) {
        // force logout by updating the record
        lastLogin.logoutTime = new Date(
          lastLogin.loginTime.getTime() + 5 * 60 * 60 * 1000
        );
        await lastLogin.save();

        return res.status(403).json({
          message:
            "Session expired due to prolonged inactivity. Please log in again.",
        });
      }
    }

    next(); // proceed if login is still valid
  } catch (error) {
    console.error("Error checking login duration:", error);
    res
      .status(500)
      .json({ message: "An error occurred while validating session." });
  }
};

// middleware for protected routes
router.get("/protected-route", checkLoginDuration, (req, res) => {
  res.send("You have access to this protected route!");
});

// login auth
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid credentials" });

    // check if the user's account is activated by admin
    if (!user.isActive)
      return res.status(403).json({ message: "User account is not activated" });

    if (!user.isAdmin) {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const visitCount = await LoginHistory.countDocuments({
        userId: user._id,
        loginTime: { $gte: oneWeekAgo },
      });

      if (visitCount > 3) {
        return res.status(429).json({
          message: "Weekly visit limit reached.",
          userId: user._id.toString(),
        });
      }

      const openSession = await LoginHistory.findOne({
        userId: user._id,
        logoutTime: null,
      });

      if (!openSession) {
        await LoginHistory.create({
          userId: user._id,
          loginTime: new Date(),
          ipAddress: req.ip,
          device: req.get("User-Agent"),
        });
      }
    }

    return res.status(200).json({
      message: "Login successful",
      isAdmin: user.isAdmin,
      firstName: user.firstName,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "An error occurred during login" });
  }
});

router.post("/login-barcode", async (req, res) => {
  const { barcode } = req.body;

  if (!barcode) {
    return res.status(400).json({ message: "Barcode is required" });
  }

  try {
    const user = await User.findOne({
      email: { $regex: `^${barcode}@`, $options: "i" },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with the provided barcode" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "User account is not activated" });
    }

    if (!user.isAdmin) {
      const openSession = await LoginHistory.findOne({
        userId: user._id,
        logoutTime: null,
      });

      if (!openSession) {
        await LoginHistory.create({
          userId: user._id,
          loginTime: new Date(),
          ipAddress: req.ip,
          device: req.get("User-Agent"),
        });
      }
    }

    res.status(200).json({
      message: "Login successful",
      firstName: user.firstName,
      userId: user._id.toString(),
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("Error during barcode login:", error);
    res.status(500).json({ message: "An error occurred during barcode login" });
  }
});

router.get("/visits/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // start of week
    startOfWeek.setHours(0, 0, 0, 0);

    const visitCount = await LoginHistory.countDocuments({
      userId,
      loginTime: { $gte: startOfWeek }, // visits in the current week
    });

    res.json({ visits: visitCount });
  } catch (error) {
    console.error("Error fetching visit count:", error);
    res.status(500).json({ message: "Error fetching visit count" });
  }
});

// logout auth
router.post("/logout", async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    // find the most recent open session
    const lastLogin = await LoginHistory.findOne({
      userId,
      logoutTime: null, // open session
    }).sort({ loginTime: -1 });

    if (!lastLogin) {
      return res
        .status(404)
        .json({ message: "No active session found for this user" });
    }

    // update the logoutTime to close the session
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

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    const userId = req.user._id;

    try {
      // Check visits in the last 7 days
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const visitCount = await LoginHistory.countDocuments({
        userId,
        loginTime: { $gte: oneWeekAgo }, // Only visits within the last 7 days
      });

      // Redirect if the user has exceeded the visit limit
      if (visitCount >= 3) {
        return res.redirect(`http://localhost:3000/limit?userId=${userId}`);
      }

      // Log the visit if the user is under the limit
      const existingSession = await LoginHistory.findOne({
        userId,
        logoutTime: null, // Open session
      });

      if (!existingSession) {
        await LoginHistory.create({
          userId,
          loginTime: new Date(),
          ipAddress: req.ip,
          device: req.get("User-Agent"),
        });
      }

      // redirect to dash with the user's first name and userId
      res.redirect(
        `http://localhost:3000/dash?name=${req.user.firstName}&userId=${req.user._id}`
      );
    } catch (error) {
      console.error("Error during Google callback:", error);
      res.status(500).json({ message: "An error occurred during login." });
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
