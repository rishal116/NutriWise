import {
  MeetingStatus,
  MeetingType,
} from "@/enums/nutritionist/meeting/meeting.enum";

export interface MeetingCardResponseDTO {
  id: string;
  title: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage:string;
  };
  scheduledAt: string;
  durationInMinutes: number;
  status: MeetingStatus;
  type: MeetingType;
}
