const jwt = require("jsonwebtoken");

// Function to generate Access and Refresh Tokens
const generateTokens = (user) => {
  // Access Token (short-lived)
  const accessToken = jwt.sign(
    { _id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Access token expires in 15 minutes
  );

  // Refresh Token (longer-lived)
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // Refresh token expires in 7 days
  );

  return { accessToken, refreshToken };
};

module.exports = { generateTokens };
