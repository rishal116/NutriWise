import { api } from "@/lib/axios/api";

export const nutritionistListService = {
  getAll: async (filters = {}) => {
    const response = await api.get("/nutritionists", { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/nutritionists/${id}`);
    return response.data;
  },
};
