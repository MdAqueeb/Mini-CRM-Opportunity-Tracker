import axios from "axios";
import { TOKEN_KEY } from "../utils/constants";

// ============================================================
// Axios instance + interceptors
// ------------------------------------------------------------
// baseURL comes from the Vite env (VITE_API_URL). The request
// interceptor attaches the JWT; the response interceptor catches
// expired/invalid tokens (401) and broadcasts a logout event that
// AuthContext listens for, so session handling stays centralized.
// ============================================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// --- Request: attach Bearer token ---------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response: global 401 handling --------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    // Don't force-logout on failed login/register attempts; those
    // 401s are expected (wrong credentials) and handled locally.
    const isAuthAttempt = url.includes("/auth/login") || url.includes("/auth/register");

    if (status === 401 && !isAuthAttempt) {
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  }
);

// ============================================================
// Centralized API calls
// ============================================================

export const authAPI = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
};

export const opportunityAPI = {
  list: () => api.get("/opportunities"),
  get: (id) => api.get(`/opportunities/${id}`),
  create: (payload) => api.post("/opportunities", payload),
  update: (id, payload) => api.put(`/opportunities/${id}`, payload),
  remove: (id) => api.delete(`/opportunities/${id}`),
};

export default api;
