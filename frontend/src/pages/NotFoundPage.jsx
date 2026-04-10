// NotFoundPage.jsx - Page for handling 404 Not Found errors
// This page is displayed when a user navigates to a route that doesn't exist.
// It provides a clear message and a simple way back to the home page.

import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="container py-5 text-center">
      <div className="notfound-wrapper">
        {/* Large 404 code */}
        <h1 className="notfound-code mb-3">404</h1>

        {/* Message */}
        <h2 className="h5 mb-2">Page not found</h2>
        <p className="text-white-50 mb-4">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        {/* Navigation back to app */}
        <Link to="/" className="btn btn-light rounded-pill px-4">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;