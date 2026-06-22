import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateOpportunity from "./pages/CreateOpportunity";
import EditOpportunity from "./pages/EditOpportunity";
import OpportunityDetails from "./pages/OpportunityDetails";
import NotFound from "./pages/NotFound";

// Layout for authenticated pages: Navbar + routed content.
const AppLayout = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <Outlet />
    </main>
  </div>
);

// Keep logged-in users away from /login and /register.
const PublicOnly = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

      {/* Protected (wrapped in layout with Navbar) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-opportunity" element={<CreateOpportunity />} />
        <Route path="/edit-opportunity/:id" element={<EditOpportunity />} />
        <Route path="/opportunity/:id" element={<OpportunityDetails />} />
      </Route>

      {/* Redirects + 404 */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
