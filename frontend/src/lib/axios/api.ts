import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";
import { userAuthService } from "@/services/user/userAuth.service";
import { setToken } from "@/redux/slices/authSlice";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = store.getState().auth.token;
      if (token) config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const authEndpoints = ["/login", "/signup", "/google"];

    if (authEndpoints.some((url) => originalRequest.url?.includes(url))) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error.response?.data || error);
    }

    if (originalRequest.url?.includes("/refresh-token")) {
      return Promise.reject(error.response?.data || error);
    }

    // ✅ 401 TOKEN REFRESH
    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        const res = await api.get("/refresh-token");

        const newToken = res.data?.accessToken;
        if (!newToken) throw new Error("No access token");

        store.dispatch(setToken(newToken));
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        window.location.href = "/";

        if (axios.isAxiosError(err)) {
          return Promise.reject(err.response?.data || { message: err.message });
        }

        return Promise.reject({ message: "Something went wrong" });
      }
    }

    // ✅ 403 LOGOUT
    if (error.response?.status === 403) {
      store.dispatch(logout());
      await userAuthService.logout();
      window.location.href = "/";
      return Promise.reject(error.response?.data);
    }

    // ✅ 🔥 HANDLE 404 + 500 + OTHERS
    if (error.response) {
      const message = error.response.data?.message || "Something went wrong";

      return Promise.reject({
        status: error.response.status,
        message,
      });
    }

    // ✅ NETWORK ERROR
    if (error.request) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
      });
    }

    // ✅ FALLBACK
    return Promise.reject({
      message: error.message,
    });
  },
);
