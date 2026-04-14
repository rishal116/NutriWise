import { api } from "@/lib/axios/api";

export const nutritionistAuthService = {
  submitDetails: async (data: FormData,token) => {
    
    if (!token) throw new Error("Unauthorized - No token found");
    const response = await api.post("/nutritionist/submit-details", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  
  getMyDetails:async () => {
    return api.get("/nutritionist/details/me");
  },
  
  getName: async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/nutritionist/getName", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getNotifications: async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/nutritionist/notification", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; 
  },
  

};
