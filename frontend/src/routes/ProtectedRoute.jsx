import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

// ============================================================
// ProtectedRoute
// ------------------------------------------------------------
// Wraps private routes. While the session is being restored we
// show a loader (avoids a flash redirect). If unauthenticated we
// redirect to /login and remember where the user was heading so
// we can send them back after login.
// ============================================================

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader label="Restoring your session…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
