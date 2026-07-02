import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_ROUTES } from "@/routes/user.routes";
import { store } from "@/redux/store";
import { logout, setToken } from "@/redux/slices/authSlice";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ApiErrorResponse {
  success: boolean;
  message: string;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const ignoredRoutes = [
      API_ROUTES.AUTH.LOGIN,
      API_ROUTES.AUTH.SIGNUP,
      API_ROUTES.AUTH.VERIFY_OTP,
      API_ROUTES.AUTH.RESEND_OTP,
      API_ROUTES.AUTH.GOOGLE,
      API_ROUTES.AUTH.FORGOT_PASSWORD,
      API_ROUTES.AUTH.RESET_PASSWORD,
    ];

    if (ignoredRoutes.some((route) => originalRequest.url?.includes(route))) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes(API_ROUTES.AUTH.REFRESH_TOKEN) ||
      originalRequest._retry
    ) {
      store.dispatch(logout());

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }

      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        const response = await api.post<{
          success: boolean;
          accessToken: string;
        }>(API_ROUTES.AUTH.REFRESH_TOKEN);

        const accessToken = response.data.accessToken;

        store.dispatch(setToken(accessToken));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch {
        store.dispatch(logout());

        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
