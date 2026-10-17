"use client";

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { AUTH_ROUTES } from "@/routes/user/auth.routes";
import { logout, setAccessToken } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import { userAuthService } from "@/services/user/userAuth.service";
import { redirectToLogin } from "@/lib/auth/authGuard";
import { tokenStorage } from "@/lib/auth/tokenStorage";

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

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = userAuthService
      .refreshToken()
      .then((response) => {
        if (!response.accessToken) {
          throw new Error("Refresh response did not contain an access token.");
        }

        store.dispatch(setAccessToken(response.accessToken));

        return response.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

clientApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authState = store.getState().auth;
    const accessToken = authState.accessToken ?? tokenStorage.get();

    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    } else {
      config.headers.delete("Authorization");
    }

    if (config.requiresAuth && authState.initialized) {
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
    }

    return config;
  },
  (error: unknown) => Promise.reject(error),
);

clientApi.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest || isIgnoredRoute(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const code = error.response.data?.code;
    const shouldRefreshToken = [
      "ACCESS_TOKEN_EXPIRED",
      "ACCESS_TOKEN_MISSING",
    ].includes(code ?? "");

    if (shouldRefreshToken && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();

        originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);

        return clientApi(originalRequest);
      } catch (refreshError: unknown) {
        const authState = store.getState().auth;

        if (authState.isAuthenticated || originalRequest.requiresAuth) {
          store.dispatch(logout());

          if (originalRequest.requiresAuth) {
            redirectToLogin();
          }
        }

        return Promise.reject(refreshError);
      }
    }

    const authState = store.getState().auth;

    if (authState.isAuthenticated || originalRequest.requiresAuth) {
      store.dispatch(logout());

      if (originalRequest.requiresAuth) {
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  },
);
