export interface CreateMeetingDTO {
  title: string;
  userId: string;
  nutritionistId: string;
  scheduledAt: string;
  durationInMinutes: number;
  type: "video" | "audio";
}