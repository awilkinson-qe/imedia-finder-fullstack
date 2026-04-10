// authMiddleware.js - Middleware to protect routes by verifying JWT tokens
// This module exports a middleware function that checks for a valid Bearer token in the Authorization header and verifies it using the JWT secret.
const jwt = require("jsonwebtoken");

// Protect routes by requiring a valid Bearer token.
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check that the header exists and uses the Bearer format.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Token missing.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify and attach the decoded token payload to the request.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;