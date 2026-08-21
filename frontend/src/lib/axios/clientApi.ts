import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { AUTH_ROUTES } from "@/routes/user/auth.routes";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";
import { userAuthService } from "@/services/user/userAuth.service";

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
      await userAuthService.refreshToken();

      return clientApi(originalRequest);
    } catch (refreshError) {
      store.dispatch(logout());

      return Promise.reject(refreshError);
    }
  },
);
