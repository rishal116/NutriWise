import { api } from "@/lib/axios/clientApi";

export const nutritionistSubscriptionService = {
  getSubscriptions: async () => {
    const res = await api.get("/nutritionist/subscription");
    return res.data;
  },
  getSubscribers: async () => {
    const res = await api.get("/nutritionist/subscribers");
    return res.data;
  },
};
