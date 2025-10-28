import { api } from "@/lib/api";
import { UserSignupType} from "@/validation/userAuth.validation";

export const userAuthService = {
  register: async (payload: UserSignupType) => {
    const response = await api.post("/signup", {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      confirmPassword : payload.confirmPassword
    });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await api.post("/verify-otp", { email, otp });
    return response.data;
  },

  resendOtp: async (email: string) => {
    const response = await api.post("/resend-otp", { email });
    return response.data
  },
  
  selectRole: async (data: { email: string; role: string }) => {
    const res = await api.post("/select-role", data);
    return res.data;
  },



  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
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
