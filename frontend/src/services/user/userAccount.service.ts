import { server } from "@/lib/axios/server";
import { api } from "@/lib/axios/api";

export const userAccountService = {
  getProfile: async () => {
    const response = await api.get("/profile");
    console.log(response);
    
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
    const response = await server.put("/users/profile", payload);
    return response.data;
  },

  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await server.put("/users/profile/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },
};
