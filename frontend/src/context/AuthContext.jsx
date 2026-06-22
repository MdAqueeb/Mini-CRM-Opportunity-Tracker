import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authAPI } from "../services/api";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";

// ============================================================
// AuthContext
// ------------------------------------------------------------
// Single source of truth for auth state across the app.
//
// Persistence model:
//  - On login we store the JWT under TOKEN_KEY and the user object
//    under USER_KEY in localStorage. The axios request interceptor
//    (services/api.js) reads the token on every request.
//  - On first mount we hydrate state from localStorage so a page
//    refresh keeps the user logged in, then verify the token with
//    GET /auth/me. If that fails (expired/invalid), we log out.
//  - api.js dispatches a window "auth:logout" event on any 401,
//    which we listen to here to clear state app-wide.
// ============================================================

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  // `loading` covers the initial session-restore check so ProtectedRoute
  // doesn't bounce the user to /login before we've verified the token.
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback((jwt, userData) => {
    localStorage.setItem(TOKEN_KEY, jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
  }, []);

  // Restore + validate session on first load.
  useEffect(() => {
    let active = true;
    const restore = async () => {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (!stored) {
        setLoading(false);
        return;
      }
      try {
        // /auth/me confirms the token is still valid and refreshes
        // the user object from the server.
        const { data } = await authAPI.me();
        if (!active) return;
        const fresh = data?.data;
        if (fresh) {
          const normalized = {
            id: fresh._id || fresh.id,
            name: fresh.name,
            email: fresh.email,
          };
          setUser(normalized);
          localStorage.setItem(USER_KEY, JSON.stringify(normalized));
        }
      } catch {
        if (active) logout();
      } finally {
        if (active) setLoading(false);
      }
    };
    restore();
    return () => {
      active = false;
    };
  }, [logout]);

  // Listen for global 401s broadcast by the axios interceptor.
  useEffect(() => {
    window.addEventListener("auth:logout", logout);
    return () => window.removeEventListener("auth:logout", logout);
  }, [logout]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Convenience hook with a guard so misuse fails loudly.
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export default AuthContext;
