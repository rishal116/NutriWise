import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";

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
      const token = localStorage.getItem("token");
      
      if (token) config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Prevent endless loop
    if (originalRequest.url?.includes("/refresh-token")) {
      return Promise.reject(error);
    }

    // 401 → try refresh
  if ( error.response?.status === 401 && !originalRequest._retry && 
    !originalRequest.url.includes("/login") && localStorage.getItem("token")) {
      originalRequest._retry = true;
      try {
        const res = await api.post( "/refresh-token", {},
          { headers: { Authorization: "" } }
        );
        const newToken = res.data?.accessToken;
        if (newToken) {
          localStorage.setItem("token", newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
        throw new Error("No new token received");
      } catch (err) {
        store.dispatch(logout());
        localStorage.clear();
        window.location.href = "/"
        return Promise.reject(err);
      }
    }


    // 403 → blocked or forbidden
    if (error.response?.status === 403) {
      store.dispatch(logout());
      localStorage.clear();
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);
