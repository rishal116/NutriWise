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
    const response = await api.post("/verify-otp", { email, otp },{ withCredentials: true });
    return response.data;
  },

  resendOtp: async (email: string) => {
    const response = await api.post("/resend-otp", { email });
    return response.data
  },
  
  logout: async () => {
    await api.post("/logout", {}, { withCredentials: true });
    localStorage.removeItem("clientAccessToken");
    window.location.href = "/client/login";
  },


  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    return response.data;
  },
  
  
  async googleSignup(payload: {
    fullName: string;
    email: string;
    googleId: string;
    role: string;
    credential: string;}) {
      const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/google`,payload);
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
  const response = await api.post("/forgot-password", { email });
  return response.data;
},

resetPassword: async (token: string, password: string) => {
  const response = await api.post("/reset-password", { token, password });
  return response.data;
},
};
