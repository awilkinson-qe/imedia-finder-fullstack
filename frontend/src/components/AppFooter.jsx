// AppFooter.jsx - Footer component for the iTunes Search app
// This component renders a simple footer that appears at the bottom of the page. It includes the current year and some optional subtext about the technologies used to build the app.
function AppFooter() {
  return (
    // Footer sits at bottom due to flex layout in App.jsx
    <footer className="app-footer mt-auto">
      <div className="container text-center py-3">

        {/* Primary footer text */}
        <small className="text-white-50">
          © {new Date().getFullYear()} iTunes Search
        </small>

        {/* Optional subtle subtext */}
        <div className="footer-subtext">
          Built with React, Express & JWT · All rights reserved
        </div>

      </div>
    </footer>
  );
}

export default AppFooter;