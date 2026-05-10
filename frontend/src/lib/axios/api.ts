import axios from "axios";
import { store } from "@/redux/store";
import { logout, setToken } from "@/redux/slices/authSlice";
import { userAuthService } from "@/services/user/userAuth.service";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─────────────────────────────
// REQUEST INTERCEPTOR
// ─────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = store.getState().auth.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─────────────────────────────
// RESPONSE INTERCEPTOR
// ─────────────────────────────
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Skip retry for auth endpoints
    const authEndpoints = [
      "/login",
      "/signup",
      "/google",
      "/verify-otp",
      "/forgot-password",
      "/reset-password",
    ];

    if (
      authEndpoints.some((url) =>
        originalRequest.url?.includes(url),
      )
    ) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Never retry refresh endpoint itself
    if (originalRequest.url?.includes("/refresh-token")) {
      return Promise.reject(error);
    }

    // ─────────────────────────────
    // 401 → Refresh Token Logic
    // ─────────────────────────────
    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.get("/refresh-token");

        const newAccessToken =
          refreshResponse.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token received");
        }

        // Update Redux token
        store.dispatch(setToken(newAccessToken));

        // Retry failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → Full logout
        store.dispatch(logout());

        try {
          await userAuthService.logout();
        } catch {
          // Ignore logout API failure
        }

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // ─────────────────────────────
    // 403 → Invalid/Expired Refresh Token
    // ─────────────────────────────
    if (error.response?.status === 403) {
      store.dispatch(logout());

      try {
        await userAuthService.logout();
      } catch {
        // Ignore logout failure
      }

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    // ─────────────────────────────
    // Server responded with error
    // ─────────────────────────────
    if (error.response) {
      return Promise.reject(error);
    }

    // ─────────────────────────────
    // Network/server unreachable
    // ─────────────────────────────
    if (error.request) {
      return Promise.reject(error);
    }

    // ─────────────────────────────
    // Unknown error fallback
    // ─────────────────────────────
    return Promise.reject(error);
  },
);