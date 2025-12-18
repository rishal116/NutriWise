import { api } from "@/lib/axios/api";
import { UserSignupType} from "@/validation/userAuth.validation";

export const userAuthService = {
  register: async (payload: UserSignupType) => {
    const response = await api.post("/signup", payload);
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await api.post("/verify-otp", { email, otp },{ withCredentials: true });
    return response.data;
  },

  resendOtp: async (email: string) => {
    const response = await api.post("/resend-otp", { email });
    return response.data
  },
  
  logout: async () => {
    await api.post("/logout", {}, { withCredentials: true });
    localStorage.removeItem("token");
    window.location.href = "/";
  },


  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    return response.data;
  },
  
  googleSignup: async (payload: any) => {
    const response = await api.post("/google", payload);
    return response.data;
  },
  
  forgotPassword: async (email: string) => {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  },
  
  resetPassword: async (token: string, password: string) => {
    const response = await api.post("/reset-password", { token, password });
    return response.data;
  },

  getMe: async () => {
    const res = await api.get("/me");
    return res.data;
  },
  
  googleSignin: async (payload: any) => {
    const response = await api.post("/google-signin", payload);
    return response.data;
  },

};
