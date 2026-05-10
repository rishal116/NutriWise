"use client";

import axios, {
  InternalAxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const redirectToAdminLogin = () => {
  localStorage.removeItem("adminToken");

  if (typeof window !== "undefined") {
    window.location.href = "/admin/login";
  }
};

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

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest =
      error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // prevent infinite retry loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // skip refresh route itself
    if (
      originalRequest.url?.includes(
        "/admin/refresh-token",
      )
    ) {
      return Promise.reject(error);
    }

    // auto refresh on unauthorized
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/admin/login")
    ) {
      originalRequest._retry = true;

      try {
        const res = await adminApi.post(
          "/admin/refresh-token",
        );

        const newToken = res.data?.accessToken;

        if (!newToken) {
          throw new Error(
            "No admin access token received",
          );
        }

        localStorage.setItem(
          "adminToken",
          newToken,
        );

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return adminApi(originalRequest);
      } catch (refreshError) {
        redirectToAdminLogin();
        return Promise.reject(refreshError);
      }
    }

    // forbidden
    if (error.response?.status === 403) {
      redirectToAdminLogin();
    }

    return Promise.reject(error);
  },
);