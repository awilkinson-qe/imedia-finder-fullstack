// ProtectedRoute.jsx - Component for protecting routes based on authentication
// This component checks if the user is authenticated before rendering the protected content. If not authenticated, it redirects to the login page.
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  // Read auth state from context.
  const { isAuthenticated, loading } = useAuth();

  // Wait until auth state has been checked before redirecting.
  if (loading) {
    return (
      <div className="container py-5 text-center text-white-50">
        <div className="spinner-border mb-3" role="status" aria-hidden="true" />
        <p className="mb-0">Checking your session...</p>
      </div>
    );
  }

  // Only render protected content when authenticated.
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;