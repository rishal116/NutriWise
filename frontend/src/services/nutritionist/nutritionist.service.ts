import { api } from "@/lib/api";

export const nutritionistAuthService = {
  register: async (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await api.post("/nutritionist/signup", payload);
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await api.post("/nutritionist/verify-otp", { email, otp },{ withCredentials: true });
    return response.data;
  },
  
  resendOtp: async (email: string) => {
    const response = await api.post("/nutritionist/resend-otp", { email });
    return response.data;
  },


  login: async (email: string, password: string) => {
    const response = await api.post("/nutritionist/login", { email, password });
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
    
    
    submitDetails: async (data: FormData) => {
      const token = localStorage.getItem("token");
      const response = await api.post("/nutritionist/submit-details", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
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
    const response = await api.post("/nutritionist/reset-password", {
      email,
      newPassword,
    });
    return response.data;
  },
};
