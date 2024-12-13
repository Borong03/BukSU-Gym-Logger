const jwt = require("jsonwebtoken");

// Middleware to authenticate the JWT token
const authenticateToken = (req, res, next) => {
  // Retrieve the token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Check if the token has expired
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }

    // Attach the user data from the token to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken;
