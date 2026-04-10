// favouriteRoutes.js - Defines routes for managing user favourites
// Provides CRUD operations for favourites, all protected by JWT authentication.

const express = require("express");
const {
  getFavourites,
  addFavourite,
  deleteFavourite,
  deleteAllFavourites,
} = require("../controllers/favouriteController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ===== ROUTES =====

// Get all favourites for the logged-in user
router.get("/", authMiddleware, getFavourites);

// Add a new favourite
router.post("/", authMiddleware, addFavourite);

// Delete ALL favourites
// NOTE: Must come before "/:itemId" to avoid route conflicts
router.delete("/", authMiddleware, deleteAllFavourites);

// Delete a single favourite by itemId
router.delete("/:itemId", authMiddleware, deleteFavourite);

module.exports = router;