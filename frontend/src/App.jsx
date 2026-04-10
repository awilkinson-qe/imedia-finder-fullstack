// App.jsx - Main application component with routing and layout
// This component sets up the main layout of the app, including the navbar, footer, and routing for different pages. It uses React Router for client-side routing and includes a ProtectedRoute component to guard certain routes that require authentication.
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
    // BrowserRouter enables client-side routing across the app.
    <BrowserRouter>
      {/* Main layout wrapper:
          - flex column for header/content/footer stacking
          - min-vh-100 ensures footer sits at bottom */}
      <div className="d-flex flex-column min-vh-100">

        {/* Top navigation (visible on all pages) */}
        <AppNavbar />

        {/* Main content area:
            - flex-grow-1 pushes footer to bottom
            - app-main allows shared spacing control */}
        <main className="flex-grow-1 app-main">

          {/* Route definitions */}
          <Routes>

            {/* Public routes (no authentication required) */}
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

            {/* Catch-all route for unknown paths */}
            <Route path="*" element={<NotFoundPage />} />

          </Routes>
        </main>

        {/* Footer (always at bottom of page) */}
        <AppFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;