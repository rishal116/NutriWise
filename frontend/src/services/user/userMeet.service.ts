import { api } from "@/lib/axios/api";

export const userMeetService = {
  getMeetings: async () => {
    const res = await api.get("/meetings");
    return res.data;
  },
};
