import { api } from "@/lib/axios/api";

export const checkoutService = {
  createSession: async (planId: string, nutritionistId: string) => {
    const res = await api.post("/checkout/session", {
      planId,
      nutritionistId,
    });
    return res.data;
  },


};
