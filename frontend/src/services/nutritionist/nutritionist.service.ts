import { api } from "@/lib/api";

export const nutritionistAuthService = {
    
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
