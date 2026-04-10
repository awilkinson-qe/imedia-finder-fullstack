// searchRoutes.js - Defines routes for searching the iTunes API
// Provides a protected endpoint that proxies requests to the iTunes API.

const express = require("express");
const { searchItunes } = require("../controllers/searchController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ===== ROUTES =====

// Search iTunes API (protected route)
// Requires valid JWT token
// Supports query params: term, media, limit, offset
router.get("/", authMiddleware, searchItunes);

module.exports = router;