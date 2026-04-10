// favouriteRoutes.js - Defines routes for managing user favourites
// This module sets up Express routes for getting, adding, and deleting user favourites. It uses the favouriteController for handling the logic and authMiddleware to protect the routes.
const express = require("express");
const {
  getFavourites,
  addFavourite,
  deleteFavourite,
  deleteAllFavourites,
} = require("../controllers/favouriteController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all favourites for the logged-in user.
router.get("/", authMiddleware, getFavourites);

// Add a new favourite.
router.post("/", authMiddleware, addFavourite);

// Delete all favourites (must come BEFORE :itemId route).
router.delete("/", authMiddleware, deleteAllFavourites);

// Delete a single favourite by itemId.
router.delete("/:itemId", authMiddleware, deleteFavourite);

module.exports = router;