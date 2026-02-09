"use client"
import axios from "axios";



export const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
adminApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("adminToken");
      
      if (token) config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // don't refresh on refresh endpoint
    if (originalRequest.url?.includes("/admin/refresh-token")) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest.url.includes("/admin/login")
    ) {
      originalRequest._retry = true;

      try {
        const res = await adminApi.post("/admin/refresh-token");

        const newToken = res.data?.accessToken;
        if (!newToken) throw new Error("No admin access token");

        localStorage.setItem("adminToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return adminApi(originalRequest);
      } catch (err) {
        localStorage.removeItem("adminToken");
        console.log("1");
        window.location.href = "/admin/login";
        return Promise.reject(err);
      }
    }

    if (error.response?.status === 403) {
      localStorage.removeItem("adminToken");
      console.log("2");
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);
