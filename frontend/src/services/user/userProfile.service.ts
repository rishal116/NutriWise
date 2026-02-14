import { api } from "@/lib/axios/api";

export const userAccountService = {
  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },

  updateProfile: async (payload: {
    fullName?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    gender?: string;
    age?: number;
    profileImage?: string;
  }) => {
    const response = await api.put("/profile", payload);
    return response.data;
  },

  getProfileImage: async () => {
    const response = await api.get("/profile/upload-image");
    return response.data; 
  },
  
  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file); 
    const response = await api.post("/profile/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

};
