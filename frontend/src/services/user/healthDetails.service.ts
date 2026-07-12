import { clientApi } from "@/lib/axios/clientApi";
import { HealthDetailsPayload } from "@/constants/user/healthDetails.constant";

export const healthDetailsService = {
  getHealthDetails: async () => {
    const res = await clientApi.get("/health-details");
    return res.data;
  },

  saveHealthDetails: async (payload: HealthDetailsPayload) => {
    const res = await clientApi.post("/health-details", payload);
    return res.data;
  },
};
