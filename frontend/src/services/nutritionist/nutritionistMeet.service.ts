import { api } from "@/lib/axios/api";

export const nutritionistMeetService = {
  getMeetings: async () => {
    const res = await api.get("/nutritionist/meetings");
    return res.data;
  },

  createMeeting: async (title: string, userId: string, scheduledAt: string) => {
    const res = await api.post("/nutritionist/meetings", { title, userId, scheduledAt });
    return res.data;
  },
};
