// searchRoutes.js - Defines routes for searching the iTunes API
// This module sets up an Express route for searching the iTunes API. It uses the searchController to handle the logic and authMiddleware to protect the route.
const express = require("express");
const { searchItunes } = require("../controllers/searchController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Search iTunes API (protected route).
// Supports pagination via query params: term, media, limit, offset.
router.get("/", authMiddleware, searchItunes);

module.exports = router;