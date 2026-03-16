import { api } from "@/lib/axios/api";

export interface CreateMeetingDTO {
  title: string;
  userId: string;
  scheduledAt: string;
  durationInMinutes: number;
  type: "video" | "audio";
}

export const nutritionistMeetService = {
  /**
   * Fetches all meetings for the logged-in nutritionist
   */
  getMeetings: async () => {
    const res = await api.get("/nutritionist/meetings");
    // Supporting both { data: [...] } and direct array responses
    return res.data;
  },

  /**
   * Creates a new consultation session
   * @param data - The meeting details including duration and type
   */
  createMeeting: async (data: CreateMeetingDTO) => {
    const res = await api.post("/nutritionist/meetings", data);
    return res.data;
  },

  /**
   * Optional: Delete a meeting
   */
  deleteMeeting: async (meetingId: string) => {
    const res = await api.delete(`/nutritionist/meetings/${meetingId}`);
    return res.data;
  }
};