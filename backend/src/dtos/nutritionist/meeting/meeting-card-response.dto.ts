import { MeetingStatus, MeetingType } from "../../../models/meeting.model";

export interface MeetingCardResponseDTO {
  id: string;
  title: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage: string;
  };
  scheduledAt: Date;
  durationInMinutes: number;
  status: MeetingStatus;
  type: MeetingType;
}
