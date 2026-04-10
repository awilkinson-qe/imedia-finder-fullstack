// AppNavbar.jsx - Navigation bar component
// Provides navigation across the app and shows different options depending on authentication state.
// Includes scroll behaviour to enhance UI (adds shadow when scrolling).

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AppNavbar() {
  // Auth state + actions
  const { isAuthenticated, user, logout } = useAuth();

  // Navigation after logout
  const navigate = useNavigate();

  // Track scroll position to enhance navbar styling
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark app-navbar sticky-top ${
        scrolled ? "app-navbar-scrolled" : ""
      }`}
    >
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-semibold" to="/">
          iMedia Finder
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left navigation */}
          <div className="navbar-nav me-auto gap-lg-2">
            {isAuthenticated && (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active fw-semibold" : ""}`
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/favourites"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active fw-semibold" : ""}`
                  }
                >
                  Favourites
                </NavLink>
              </>
            )}
          </div>

          {/* Right navigation */}
          <div className="navbar-nav ms-auto align-items-start align-items-lg-center gap-lg-3">
            {isAuthenticated ? (
              <>
                {/* Username */}
                <span className="navbar-text small text-white-50">
                  {user?.username}
                </span>

                {/* Logout */}
                <button
                  className="btn btn-sm btn-outline-light rounded-pill px-3 align-self-start"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active fw-semibold" : ""}`
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active fw-semibold" : ""}`
                  }
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;