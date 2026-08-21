import {
  MeetingStatus,
  MeetingType,
} from "@/enums/user/meeting/user-meeting.enum";

export class UserMeetingListResponseDTO {
  id!: string;

  title!: string;

  nutritionist!: {
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };

  scheduledAt!: string;

  durationInMinutes!: number;

  status!: MeetingStatus;

  type!: MeetingType;
}
