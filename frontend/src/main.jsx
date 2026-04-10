// main.jsx - Entry point for the React application
// This file sets up the React application by rendering the App component inside a StrictMode wrapper. It also wraps the App with the AuthProvider to make authentication state available throughout the app. The index.css file is imported for global styles, and Bootstrap's CSS is included for styling components.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";

// Render the React application and make auth state available globally.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);