// favouriteController.js - Handles CRUD operations for user favourites
// Allows users to view, add, and remove favourites linked to their account.

const Favourite = require("../models/Favourite");

// ===== GET ALL =====

// Retrieve all favourites for the logged-in user
const getFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ user: req.user.userId }).sort({
      createdAt: -1, // newest first for better UX
    });

    res.json({ favourites });
  } catch (error) {
    console.error("Get favourites error:", error.message);

    res.status(500).json({
      message: "Failed to fetch favourites.",
    });
  }
};

// ===== ADD =====

// Add a new favourite item for the current user
const addFavourite = async (req, res) => {
  try {
    const { itemId, title, artist, image, releaseDate, mediaType } = req.body;

    // Validate required fields (minimal but sufficient)
    if (!itemId || !title || !artist) {
      return res.status(400).json({
        message: "itemId, title, and artist are required.",
      });
    }

    const favourite = await Favourite.create({
      user: req.user.userId,
      itemId,
      title,
      artist,
      image,
      releaseDate,
      mediaType,
    });

    res.status(201).json({
      message: "Favourite added.",
      favourite,
    });
  } catch (error) {
    // Handle duplicate entries (same user + same itemId)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Item already in favourites.",
      });
    }

    console.error("Add favourite error:", error.message);

    res.status(500).json({
      message: "Failed to add favourite.",
    });
  }
};

// ===== DELETE ONE =====

// Remove a specific favourite by itemId
const deleteFavourite = async (req, res) => {
  try {
    const { itemId } = req.params;

    const deleted = await Favourite.findOneAndDelete({
      user: req.user.userId,
      itemId,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Favourite not found.",
      });
    }

    res.json({
      message: "Favourite removed.",
    });
  } catch (error) {
    console.error("Delete favourite error:", error.message);

    res.status(500).json({
      message: "Failed to remove favourite.",
    });
  }
};

// ===== DELETE ALL =====

// Remove all favourites for the current user
// Designed to work regardless of how many items exist
const deleteAllFavourites = async (req, res) => {
  try {
    await Favourite.deleteMany({ user: req.user.userId });

    res.json({
      message: "All favourites deleted.",
    });
  } catch (error) {
    console.error("Delete all favourites error:", error.message);

    res.status(500).json({
      message: "Failed to delete all favourites.",
    });
  }
};

module.exports = {
  getFavourites,
  addFavourite,
  deleteFavourite,
  deleteAllFavourites,
};