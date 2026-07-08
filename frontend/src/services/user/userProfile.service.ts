import { clientApi} from "@/lib/axios/clientApi";

export const userAccountService = {
  getProfile: async () => {
    const response = await clientApi.get("/profile");
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
    const response = await clientApi.put("/profile", payload);
    return response.data;
  },

  getProfileImage: async () => {
    const response = await clientApi.get("/profile/upload-image");
    return response.data; 
  },
  
  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file); 
    const response = await clientApi.post("/profile/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

};
