import { api } from "@/lib/axios/api";

export const userChatService = {
  createChat: async (otherUserId: string) => {
    const res = await api.post("/chat/conversation", {
      otherUserId,
    });

    return res.data;
  },
};
