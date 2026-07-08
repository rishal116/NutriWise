import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_ROUTES } from "@/routes/user.routes";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";

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
  headers: {
    "Content-Type": "application/json",
  },
});

const ignoredRoutes = [
  API_ROUTES.AUTH.LOGIN,
  API_ROUTES.AUTH.SIGNUP,
  API_ROUTES.AUTH.VERIFY_OTP,
  API_ROUTES.AUTH.RESEND_OTP,
  API_ROUTES.AUTH.GOOGLE,
  API_ROUTES.AUTH.FORGOT_PASSWORD,
  API_ROUTES.AUTH.RESET_PASSWORD,
  API_ROUTES.AUTH.REFRESH_TOKEN,
];

clientApi.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (ignoredRoutes.some((route) => originalRequest.url?.includes(route))) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (
      status !== 401 ||
      !["ACCESS_TOKEN_EXPIRED", "ACCESS_TOKEN_MISSING"].includes(code ?? "") ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await clientApi.post(API_ROUTES.AUTH.REFRESH_TOKEN);

      return clientApi(originalRequest);
    } catch (refreshError) {
      store.dispatch(logout());

      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  },
);
