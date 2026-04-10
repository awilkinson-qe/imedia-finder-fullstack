// Favourite.js - Mongoose model for user favourites
// Stores media items saved by users from the iTunes API.

const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    // Reference to the owning user (one-to-many relationship)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // External iTunes identifier (stored as string for consistency)
    itemId: {
      type: String,
      required: true,
      trim: true,
    },

    // Core display fields used in the frontend
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional metadata fields
    image: {
      type: String,
      default: "",
      trim: true,
    },
    releaseDate: {
      type: String,
      default: "",
      trim: true,
    },
    mediaType: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    // Automatically track creation and update timestamps
    timestamps: true,
  }
);

// Prevent duplicate favourites per user (same item cannot be saved twice)
favouriteSchema.index({ user: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model("Favourite", favouriteSchema);