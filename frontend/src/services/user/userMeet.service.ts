import { clientApi } from "@/lib/axios/clientApi";

export const userMeetService = {
  getMeetings: async () => {
    const res = await clientApi.get("/meetings");
    return res.data;
  },
};
