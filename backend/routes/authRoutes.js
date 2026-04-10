// authRoutes.js - Defines routes for user authentication
// This module sets up Express routes for user registration, login, and retrieving the current user's details. It uses the authController for handling the logic and authMiddleware to protect certain routes.
const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register a new user and return a token.
router.post("/register", registerUser);

// Authenticate user and return a token.
router.post("/login", loginUser);

// Get details of the currently authenticated user.
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;