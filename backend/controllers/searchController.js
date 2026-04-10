// searchController.js - Handles searching the iTunes API
// Sends user search queries to the iTunes Search API and returns
// frontend-friendly results with simple pagination support.

const axios = require("axios");

// Search the iTunes API for the authenticated user
// Supports: term, media, limit, and offset
const searchItunes = async (req, res) => {
  const { term, media = "all", limit = 20, offset = 0 } = req.query;

  // Validate search input
  if (!term || !term.trim()) {
    return res.status(400).json({
      success: false,
      message: "Search term is required.",
    });
  }

  // Normalise paging values and keep them within safe bounds
  const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), 200);
  const parsedOffset = Math.max(Number(offset) || 0, 0);

  // The Apple Search API supports a maximum limit of 200.
  // To simulate offset pagination, request enough results up front,
  // then slice them locally on the server.
  const appleLimit = Math.min(parsedOffset + parsedLimit + 1, 200);

  try {
    const response = await axios.get("https://itunes.apple.com/search", {
      params: {
        term: term.trim(),
        media,
        limit: appleLimit,
      },
    });

    const rawResults = response.data.results || [];

    // Simulate offset-based paging by slicing the larger result set
    const pagedResults = rawResults.slice(
      parsedOffset,
      parsedOffset + parsedLimit
    );

    // Map the iTunes API response into a cleaner shape for the frontend
    const results = pagedResults.map((item) => ({
      itemId: String(item.trackId || item.collectionId || item.artistId),
      title:
        item.trackName ||
        item.collectionName ||
        item.artistName ||
        "Untitled",
      artist: item.artistName || "Unknown artist",
      image: (
        item.artworkUrl100 ||
        item.artworkUrl60 ||
        item.artworkUrl30 ||
        ""
      ).replace(/\/\d+x\d+bb\.jpg/, "/1000x1000bb.jpg"),
      releaseDate: item.releaseDate || "",
      mediaType: item.kind || item.wrapperType || media,
    }));

    // Check whether more results are still available
    const hasMore = rawResults.length > parsedOffset + parsedLimit;

    res.json({
      success: true,
      data: {
        results,
        hasMore,
        nextOffset: parsedOffset + results.length,
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