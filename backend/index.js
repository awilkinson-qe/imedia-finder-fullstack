// index.js - Main entry point for the Express server
// Sets up the server, connects to MongoDB, and registers all routes.
// Includes middleware for logging, security, parsing, and error handling.

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Route imports (separation of concerns)
const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");

// Load environment variables from .env file
dotenv.config();

// Establish MongoDB connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====

// Basic request logger (useful for debugging during development)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Enable CORS so the frontend can call this API
app.use(cors());

// Parse incoming JSON requests (required for POST/PUT)
app.use(express.json());

// ===== ROUTES =====

// Health check / root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

// Register API route groups
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/favourites", favouriteRoutes);

// ===== ERROR HANDLING =====

// Handle unknown routes (must come AFTER all routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Central error handler (captures unexpected errors)
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error.",
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});