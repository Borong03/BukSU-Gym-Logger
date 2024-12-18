const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcrypt");
const LoginHistory = require("../models/LoginHistory");
const { generateTokens } = require("../utils/tokenService");
const authenticateJWT = require("../utils/authMiddleware");

require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
console.log("JWT Secret:", jwtSecret); // Debugging the JWT Secret

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
router.get(
  "/protected-route",
  authenticateJWT,
  checkLoginDuration,
  (req, res) => {
    res.send("You have access to this protected route!");
  }
);

// login auth
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "😶‍🌫️ | User not found." });

    // verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(401).json({
        message:
          "🙊 | Email or Password is incorrect. Please check your credentials and try again.",
      });

    // check if the user's account is activated by admin
    if (!user.isActive)
      return res.status(403).json({
        message:
          "🙁 | User account is not activated. Please visit the admin kiosk with your requirements to get started!",
      });

    // if the user is not an admin, enforce weekly login visit limit
    if (!user.isAdmin) {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const visitCount = await LoginHistory.countDocuments({
        userId: user._id,
        loginTime: { $gte: oneWeekAgo },
      });

      // if the user has exceeded the login limit within a week, deny login
      if (visitCount >= 3) {
        return res.status(429).json({
          message: "Weekly visit limit reached.",
          userId: user._id.toString(),
        });
      }

      // check if there's an open session for the user
      const openSession = await LoginHistory.findOne({
        userId: user._id,
        logoutTime: null,
      });

      // create a new login history entry only if no open session exists
      if (!openSession) {
        await LoginHistory.create({
          userId: user._id,
          loginTime: new Date(),
          ipAddress: req.ip,
          device: req.get("User-Agent"),
        });
      }
    }

    // generate JWT Token
    const token = jwt.sign(
      { _id: user._id, email: user.email, isAdmin: user.isAdmin },
      jwtSecret,
      { expiresIn: "5h" } // token expiry time set to 5 hours
    );

    // return success response with token and user info
    return res.status(200).json({
      message: "Login successful",
      token,
      isAdmin: user.isAdmin,
      firstName: user.firstName,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "An error occurred during login" });
  }
});

// login-barcode with JWT
router.post("/login-barcode", async (req, res) => {
  const { barcode } = req.body;

  // validate barcode input
  if (!barcode) {
    return res.status(400).json({ message: "Barcode is required" });
  }

  try {
    // Search for a user by matching their email with the barcode pattern
    const user = await User.findOne({
      email: { $regex: `^${barcode}@`, $options: "i" },
    });

    // If no user is found
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with the provided barcode" });
    }

    // Check if the user account is active
    if (!user.isActive) {
      return res.status(403).json({ message: "User account is not activated" });
    }

    // Log login time for non-admin users
    if (!user.isAdmin) {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const visitCount = await LoginHistory.countDocuments({
        userId: user._id,
        loginTime: { $gte: oneWeekAgo },
      });

      // Deny login if weekly visit limit is exceeded
      if (visitCount >= 3) {
        return res.status(429).json({
          message: "Weekly visit limit reached.",
          userId: user._id.toString(),
        });
      }

      const openSession = await LoginHistory.findOne({
        userId: user._id,
        logoutTime: null,
      });

      // Create a new login history entry only if no open session exists
      if (!openSession) {
        await LoginHistory.create({
          userId: user._id,
          loginTime: new Date(),
          ipAddress: req.ip,
          device: req.get("User-Agent"),
        });
      }
    }

    // Generate a JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email, isAdmin: user.isAdmin },
      jwtSecret,
      { expiresIn: "5h" }
    );

    // Send a successful response with the token and user details
    res.status(200).json({
      message: "Login successful",
      token,
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

// logout auth with JWT
router.post("/logout", authenticateJWT, async (req, res) => {
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

// callback route for Google OAuth
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login?error=google_auth_failed",
  }),
  async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        console.error("Google OAuth: User not found.");
        return res.redirect("http://localhost:3000/login?error=user_not_found");
      }

      if (!user.isActive) {
        console.warn(`Inactive user: ${user.email}`);
        return res.redirect(
          "http://localhost:3000/login?error=inactive_account"
        );
      }

      // Check visit limits and log login time for non-admin users
      if (!user.isAdmin) {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const visitCount = await LoginHistory.countDocuments({
          userId: user._id,
          loginTime: { $gte: oneWeekAgo },
        });

        if (visitCount >= 3) {
          console.warn(`Weekly visit limit reached for user: ${user.email}`);
          return res.redirect(
            `http://localhost:3000/login?error=visit_limit_reached`
          );
        }

        // Create login entry only if no open session exists
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

      // Generate JWT token and redirect
      const token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        jwtSecret,
        { expiresIn: "5h" }
      );

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      return res.redirect(
        `${frontendUrl}/authenticator?token=${token}&name=${encodeURIComponent(
          user.firstName
        )}&userId=${user._id}&isAdmin=${user.isAdmin}`
      );
    } catch (error) {
      console.error("Google OAuth error:", error);
      return res.redirect("/login?error=auth_error");
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
