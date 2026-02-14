import { api } from "@/lib/axios/api";

export const nutritionistListService = {
  getAll: async (filters = {}) => {
    const res = await api.get("/nutritionists", { params: filters });
    return res.data;
  },


  getById: async (nutritionistId: string) => {
    const response = await api.get(`/nutritionists/${nutritionistId}`);
    return response.data.data;
  },
  
  getPlans: async (nutritionistId: string) => {
    const response = await api.get(`/nutritionists/${nutritionistId}/plans`);
    return response.data;
  },

};
