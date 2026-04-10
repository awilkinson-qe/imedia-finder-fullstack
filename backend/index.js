// index.js - Main entry point for the Express server
// This file sets up the Express server, connects to MongoDB, and registers routes for authentication, searching, and managing favourites. It also includes basic middleware for logging, CORS, JSON parsing, sanitization, and error handling.
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic request logger for debugging and visibility.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Allow frontend requests and JSON request bodies.
app.use(cors());
app.use(express.json());

// Sanitize request data to help prevent MongoDB operator injection.
app.use(mongoSanitize());

// Rate limit authentication routes to reduce brute-force attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication requests. Please try again later.",
  },
});

// Simple health/root route.
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

// Route registration.
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/favourites", favouriteRoutes);

// Catch unknown API routes.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Central error handler.
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});