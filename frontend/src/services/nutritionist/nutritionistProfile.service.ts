import { api } from "@/lib/axios/api";


export const nutritionistProfileService = {
  getProfile: async () => {
    const response = await api.get("/nutritionist/profile");
    console.log(response);
    
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put("/nutritionist/profile", data);
    return response.data;
  },

  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/nutritionist/profile/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },
};
