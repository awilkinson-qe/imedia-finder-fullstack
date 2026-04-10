// Favourite.js - Mongoose model for user favourites
// This module defines the schema and model for storing user favourites in MongoDB.
const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    // The user who owns this saved favourite.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // External iTunes identifier stored as a string for consistency.
    itemId: {
      type: String,
      required: true,
      trim: true,
    },

    // Main display fields used by the frontend.
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

    // Optional metadata.
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
    timestamps: true,
  }
);

// Prevent the same user from saving the same item more than once.
favouriteSchema.index({ user: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model("Favourite", favouriteSchema);