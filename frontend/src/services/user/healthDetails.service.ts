import { api } from "@/lib/axios/api";
import { HealthDetailsPayload } from "@/constants/user/healthDetails.constant";


export const healthDetailsService = {
  get: async () => {
    const res = await api.get("/health-details");
    return res.data;
  },

  save: async (payload: HealthDetailsPayload) => {
    const res = await api.post("/health-details", payload);
    return res.data;
  }
};
