import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/helpers";
import Button from "./Button";

// ============================================================
// Navbar — brand, primary nav, current user + logout.
// Shown only on authenticated pages (rendered by AppLayout).
// ============================================================

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Opportunity Tracker logo" className="h-8 w-8" />
            <span className="hidden text-base font-semibold text-secondary sm:block">
              Opportunity Tracker
            </span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/create-opportunity" className={linkClass}>
              New
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-white">
              {getInitials(user?.name) || "U"}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium text-secondary">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
