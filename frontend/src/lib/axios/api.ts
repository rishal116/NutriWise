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
      const token = store.getState().auth.token     
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

    // Auth endpoints should NOT trigger refresh
    const authEndpoints = ["/login","/signup","/google"];

    if (authEndpoints.some((url) => originalRequest.url?.includes(url))) {
      return Promise.reject(error);
    }

    // stop infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // don't refresh on refresh endpoint itself
    if (originalRequest.url?.includes("/refresh-token")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/refresh-token");

        const newToken = res.data?.accessToken;
        if (!newToken) throw new Error("No access token");

        store.dispatch(setToken(newToken));
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    if (error.response?.status === 403) {
      store.dispatch(logout());
      await userAuthService.logout()
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);
