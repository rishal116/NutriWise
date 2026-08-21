import { MeetingStatus, MeetingType } from "../../../models/meeting.model";

export class UserMeetingListResponseDTO {
  id!: string;

  title!: string;

  nutritionist!: {
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };

  scheduledAt!: Date;

  durationInMinutes!: number;

  status!: MeetingStatus;

  type!: MeetingType;
}