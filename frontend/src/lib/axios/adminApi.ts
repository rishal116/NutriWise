"use client";

import axios, { InternalAxiosRequestConfig } from "axios";
import { store } from "@/redux/store";
import { logout, setToken } from "@/redux/slices/authSlice";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* REQUEST INTERCEPTOR */
adminApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/* RESPONSE INTERCEPTOR */
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Skip retry for login/logout
    if (originalRequest.url?.includes("/admin/login") || originalRequest.url?.includes("/admin/logout")) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        // Use unified refresh token endpoint (could be common or admin-specific but uses same cookie)
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/refresh-token`, {
          withCredentials: true,
        });

        const newToken = res.data?.accessToken;
        if (!newToken) throw new Error("No token received");

        store.dispatch(setToken(newToken));
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return adminApi(originalRequest);
      } catch (refreshError) {
        // Full logout if refresh fails
        store.dispatch(logout());
        if (typeof window !== "undefined") {
          window.location.href = "/admin/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden - No hard redirect anymore
    if (error.response?.status === 403) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);