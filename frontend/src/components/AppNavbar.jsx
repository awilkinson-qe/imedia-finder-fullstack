// AppNavbar.jsx - Navigation bar component for the iTunes Search app
// This component renders a responsive navigation bar that includes links to the home page, favourites page, and authentication controls. It also adds a shadow when the page is scrolled for better visibility.  
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AppNavbar() {
  // Access authentication state and actions.
  const { isAuthenticated, user, logout } = useAuth();

  // Used to redirect after logout.
  const navigate = useNavigate();

  // Track whether the page has scrolled so we can add a shadow.
  const [scrolled, setScrolled] = useState(false);

  // Update navbar styling when the page scrolls.
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle user logout and redirect to login page.
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
        {/* Brand / logo */}
        <Link className="navbar-brand fw-semibold" to="/">
          iTunes
        </Link>

        {/* Mobile toggle button */}
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

        {/* Collapsible navigation content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left side navigation (only when logged in) */}
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

          {/* Right side navigation (auth controls) */}
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            {isAuthenticated ? (
              <>
                <span className="navbar-text small text-white-50">
                  {user?.username}
                </span>

                <button
                  className="btn btn-sm btn-outline-light rounded-pill px-3"
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