// AppFooter.jsx - Footer component
// Displays a simple footer at the bottom of the application.
// Includes dynamic year and a short tech summary for portfolio clarity.

function AppFooter() {
  return (
    <footer className="app-footer mt-auto">
      <div className="container text-center py-3">

        {/* Main footer text */}
        <small className="text-white-50">
          © {new Date().getFullYear()} iMedia Finder
        </small>

        {/* Subtext for context / portfolio clarity */}
        <div className="footer-subtext">
          Built with React, Express, MongoDB & JWT authentication
        </div>

      </div>
    </footer>
  );
}

export default AppFooter;