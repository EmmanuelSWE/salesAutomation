import axios, { AxiosInstance } from "axios";

const TOKEN_KEY = "auth_token";

/* ══════════════════════════════════════════════════════
   LOCAL STORAGE HELPERS — guarded for SSR safety
══════════════════════════════════════════════════════ */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem(TOKEN_KEY); }
  catch { return null; }
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(TOKEN_KEY, token); }
  catch { /* storage unavailable */ }
};

export const clearToken = (): void => {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(TOKEN_KEY); }
  catch { /* storage unavailable */ }
};

/* ══════════════════════════════════════════════════════
   AXIOS INSTANCE
══════════════════════════════════════════════════════ */
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL,
});

/* Attach Bearer token from localStorage on every request */
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* Global 401 handler — clear token and redirect to login */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;