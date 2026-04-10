// App.jsx - Main application component with routing and layout
// This component sets up the overall structure of the app, including:
// - Navigation bar (top)
// - Routed page content (middle)
// - Footer (bottom)
// It uses React Router for client-side navigation and ProtectedRoute
// to restrict access to authenticated users only.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import AppFooter from "./components/AppFooter";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import FavouritesPage from "./pages/FavouritesPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    // Enables client-side routing across the application
    <BrowserRouter>
      {/* Main layout wrapper:
          - flex column ensures vertical layout
          - min-vh-100 keeps footer at the bottom */}
      <div className="d-flex flex-column min-vh-100">

        {/* Top navigation (always visible) */}
        <AppNavbar />

        {/* Main content area */}
        <main className="flex-grow-1 app-main">

          <Routes>

            {/* Public routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Home route */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            {/* Protected Favourites route */}
            <Route
              path="/favourites"
              element={
                <ProtectedRoute>
                  <FavouritesPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all for unknown routes */}
            <Route path="*" element={<NotFoundPage />} />

          </Routes>
        </main>

        {/* Footer (always at bottom) */}
        <AppFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;