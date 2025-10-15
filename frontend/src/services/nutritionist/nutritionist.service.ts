import { api } from "@/lib/api";

export const nutritionistAuthService = {
  register: async (payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    qualifications?: string;
    experience?: string;
  }) => {
    const response = await api.post("/nutritionist/auth/register", payload);
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await api.post("/nutritionist/auth/verify-otp", { email, otp });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post("/nutritionist/auth/login", { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/nutritionist/profile");
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put("/nutritionist/profile", data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post("/nutritionist/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (email: string, newPassword: string) => {
    const response = await api.post("/nutritionist/auth/reset-password", {
      email,
      newPassword,
    });
    return response.data;
  },
};
