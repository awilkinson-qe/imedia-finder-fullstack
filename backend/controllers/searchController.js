// searchController.js - Handles searching the iTunes API
// This module provides a function to search the iTunes API based on user input and return results in a consistent format.

const axios = require("axios");

// Search the iTunes API for the authenticated user.
// Supports term, media, limit and offset for incremental loading.
const searchItunes = async (req, res) => {
  const {
    term,
    media = "all",
    limit = 20,
    offset = 0,
  } = req.query;

  // Validate the search term.
  if (!term || !term.trim()) {
    return res.status(400).json({
      success: false,
      message: "Search term is required.",
    });
  }

  // Normalise paging inputs and keep them within sensible limits.
  const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), 200);
  const parsedOffset = Math.max(Number(offset) || 0, 0);

  try {
    const response = await axios.get("https://itunes.apple.com/search", {
      params: {
        term: term.trim(),
        media,
        limit: parsedLimit,
        offset: parsedOffset,
      },
    });

    const rawResults = response.data.results || [];

    // Map iTunes fields into a stable frontend-friendly shape.
    const results = rawResults.map((item) => ({
      itemId: String(item.trackId || item.collectionId || item.artistId),
      title:
        item.trackName ||
        item.collectionName ||
        item.artistName ||
        "Untitled",
      artist: item.artistName || "Unknown artist",
      image:
        item.artworkUrl100 ||
        item.artworkUrl60 ||
        item.artworkUrl30 ||
        "",
      releaseDate: item.releaseDate || "",
      mediaType: item.kind || item.wrapperType || media,
    }));

    res.json({
      success: true,
      data: {
        results,
        hasMore: rawResults.length === parsedLimit,
        nextOffset: parsedOffset + rawResults.length,
      },
    });
  } catch (error) {
    console.error("iTunes API error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch iTunes results.",
    });
  }
};

module.exports = {
  searchItunes,
};