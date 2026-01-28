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

    // Prevent endless loop
    if (originalRequest.url?.includes("/admin/refresh-token")) {
      return Promise.reject(error);
    }

    // 401 → try refresh
  if ( error.response?.status === 401 && !originalRequest._retry && 
    !originalRequest.url.includes("/admin/login") && localStorage.getItem("adminToken")) {
      originalRequest._retry = true;
      try {
        const res = await adminApi.post( "/admin/refresh-token", {},
          { headers: { Authorization: "" } }
        );
        const newToken = res.data?.accessToken;
        if (newToken) {
          localStorage.setItem("adminToken", newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return adminApi(originalRequest);
        }
        throw new Error("No new token received");
      } catch (err) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login"
        return Promise.reject(err);
      }
    }


    // 403 → blocked or forbidden
    if (error.response?.status === 403) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);
