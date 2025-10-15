import { api } from "@/lib/api";

export const userAuthService = {
  register: async (payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const response = await api.post("/users/auth/register", payload);
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await api.post("/users/auth/verify-otp", { email, otp });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post("/users/auth/login", { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put("/users/profile", data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post("/users/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (email: string, newPassword: string) => {
    const response = await api.post("/users/auth/reset-password", {
      email,
      newPassword,
    });
    return response.data;
  },
};
