import { api } from "@/lib/api";
import { AdminRoutes } from "@/routes/admin.routes";

interface LoginDTO{
  email: string;
  password: string;
}

interface ForgotPasswordDTO {
  email: string;
}

interface VerifyOtpDTO {
  email: string;
  otp: string;
}

interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}

export const adminAuthService = {
  login: async (data: LoginDTO) => {
    const response = await api.post('/admin/login', data);
    return response.data; 
  },

  getProfile: async () => {
    const response = await api.get("/admin/profile");
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/admin/logout");
    localStorage.removeItem("accessToken");
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post("/admin/refresh-token");
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordDTO) => {
    const response = await api.post("/admin/forgot-password", data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpDTO) => {
    const response = await api.post("/admin/verify-otp", data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordDTO) => {
    const response = await api.post("/admin/reset-password", data);
    return response.data;
  },
};
