"use client";

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { AUTH_ROUTES } from "@/routes/user/auth.routes";
import { logout } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import { userAuthService } from "@/services/user/userAuth.service";
import { redirectToLogin } from "@/lib/auth/authGuard";

declare module "axios" {
  export interface AxiosRequestConfig {
    requiresAuth?: boolean;
    _retry?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    requiresAuth?: boolean;
    _retry?: boolean;
  }
}

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ApiErrorResponse {
  success: boolean;
  message: string;
  code?: string;
}

export const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const ignoredRoutes = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.SIGNUP,
  AUTH_ROUTES.VERIFY_OTP,
  AUTH_ROUTES.RESEND_OTP,
  AUTH_ROUTES.GOOGLE,
  AUTH_ROUTES.FORGOT_PASSWORD,
  AUTH_ROUTES.RESET_PASSWORD,
  AUTH_ROUTES.REFRESH_TOKEN,
];

function isIgnoredRoute(url?: string): boolean {
  if (!url) {
    return false;
  }

  return ignoredRoutes.some((route) => url.includes(route));
}

clientApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.requiresAuth) {
      return config;
    }

    const authState = store.getState().auth;
    if (!authState.initialized) {
      return config;
    }

    if (!authState.isAuthenticated) {
      redirectToLogin();

      return Promise.reject(
        new AxiosError(
          "Action requires authentication.",
          "ERR_UNAUTHENTICATED",
          config,
        ),
      );
    }

    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
);

clientApi.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (isIgnoredRoute(originalRequest.url)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    const code = error.response?.data?.code;

    let refreshPromise: Promise<void> | null = null;

    if (status !== 401) {
      return Promise.reject(error);
    }

    const shouldRefreshToken = [
      "ACCESS_TOKEN_EXPIRED",
      "ACCESS_TOKEN_MISSING",
    ].includes(code ?? "");

    if (shouldRefreshToken && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = userAuthService
            .refreshToken()
            .then(() => undefined)
            .finally(() => {
              refreshPromise = null;
            });
        }

        await refreshPromise;

        return clientApi(originalRequest);
      } catch (refreshError: unknown) {
        store.dispatch(logout());

        if (originalRequest.requiresAuth) {
          redirectToLogin();
        }

        return Promise.reject(refreshError);
      }
    }

    store.dispatch(logout());

    if (originalRequest.requiresAuth) {
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);
