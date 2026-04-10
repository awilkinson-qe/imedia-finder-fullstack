// main.jsx - Entry point for the React application
// This file sets up the React application by rendering the App component
// inside a StrictMode wrapper. It also wraps the App with the AuthProvider
// to make authentication state available throughout the app.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Bootstrap styles and JS bundle
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";

// Render the React application and make auth state available globally
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);