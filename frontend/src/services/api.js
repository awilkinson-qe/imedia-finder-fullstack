// api.js - Central Axios configuration for frontend API calls
// This file defines a reusable Axios instance for communicating with the backend.
// It supports both local development (via proxy) and deployed environments (via Vercel env variable).

import axios from "axios";

// Create a configured Axios instance
const api = axios.create({
  // Use deployed backend if provided, otherwise fall back to local proxy (/api)
  baseURL: import.meta.env.VITE_API_URL || "/api",

  // Default headers for JSON-based API communication
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: You could add interceptors here in future for:
// - automatically attaching JWT tokens
// - global error handling

export default api;