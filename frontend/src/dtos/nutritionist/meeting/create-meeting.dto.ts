import { MeetingType } from "@/enums/nutritionist/meeting/meeting.enum";

export interface CreateMeetingDTO {
  title: string;
  userId: string;
  scheduledAt: string;
  durationInMinutes: number;
  type: MeetingType;
}
