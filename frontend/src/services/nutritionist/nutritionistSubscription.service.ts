import { api } from "@/lib/axios/api";

export const nutritionistSubscriptionService = {
  getSubscriptions: async () => {
    const res = await api.get("/nutritionist/subscription");
    return res.data;
  },
};
