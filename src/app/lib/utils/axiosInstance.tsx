import axios, { AxiosInstance } from "axios";

const TOKEN_KEY = "auth_token";

/* ══════════════════════════════════════════════════════
   LOCAL STORAGE HELPERS — guarded for SSR safety
══════════════════════════════════════════════════════ */
export const getToken = (): string | null => {
  if (globalThis.window === undefined) return null;
  try { return localStorage.getItem(TOKEN_KEY); }
  catch { return null; }
};

export const setToken = (token: string): void => {
  if (globalThis.window === undefined) return;
  try { localStorage.setItem(TOKEN_KEY, token); }
  catch { /* storage unavailable */ }
};

export const clearToken = (): void => {
  if (globalThis.window === undefined) return;
  try { localStorage.removeItem(TOKEN_KEY); }
  catch { /* storage unavailable */ }
};

/* ══════════════════════════════════════════════════════
   AXIOS INSTANCE
   All client-side requests go through the /proxy rewrite
   in next.config.ts which forwards them to the backend.
   This avoids CORS issues when calling the Azure API
   directly from the browser.
══════════════════════════════════════════════════════ */
const api: AxiosInstance = axios.create({
  baseURL: "/proxy",
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
    if (err.response?.status === 401 && globalThis.window !== undefined) {
      clearToken();
      localStorage.removeItem("auth_user_id");
      globalThis.window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;