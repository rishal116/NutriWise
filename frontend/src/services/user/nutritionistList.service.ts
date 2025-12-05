import { server } from "@/lib/axios/server";
import { api } from "@/lib/axios/api";

export const nutritionistListService = {
  getAll: async (filters = {}) => {
    const response = await api.get("/nutritionists", { params: filters });
    console.log(response);
    
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/nutritionists/${id}`);
    console.log(response);
    
    return response.data;
  },

  getFiltered: async (params: {
    expertise?: string;
    location?: string;
    rating?: number;
    minFee?: number;
    maxFee?: number;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await server.get("/nutritionists", { params });
    return response.data;
  },
  
};
