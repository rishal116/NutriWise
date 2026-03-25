import { api } from "@/lib/axios/api";

export interface CreateMeetingDTO {
  title: string;
  userId: string;
  scheduledAt: string;
  durationInMinutes: number;
  type: "video" | "audio";
}

export const nutritionistMeetService = {
  getMeetings: async () => {
    const res = await api.get("/session/meetings");
    return res.data;
  },

  createMeeting: async (data: CreateMeetingDTO) => {
    const res = await api.post("/session/meetings", data);
    return res.data;
  },

  deleteMeeting: async (meetingId: string) => {
    const res = await api.delete(`/nutritionist/meetings/${meetingId}`);
    return res.data;
  },

  updateMeetingStatus: async (
    roomId: string,
    status: "scheduled" | "ongoing" | "completed" | "cancelled"
  ) => {
    const res = await api.patch(
      `/session/meetings/status/${roomId}`,
      { status }
    );
    return res.data;
  },
};