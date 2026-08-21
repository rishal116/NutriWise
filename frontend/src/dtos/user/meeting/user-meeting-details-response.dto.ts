import {
  MeetingStatus,
  MeetingType,
} from "@/enums/user/meeting/user-meeting.enum";

export class UserMeetingDetailsResponseDTO {
  id!: string;

  title!: string;

  nutritionist!: {
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };

  roomId!: string;

  scheduledAt!: string;

  durationInMinutes!: number;

  status!: MeetingStatus;

  type!: MeetingType;

  startedAt?: string;

  endedAt?: string;

  nutritionistJoinedAt?: string;

  userJoinedAt?: string;

  isCancelledByUser!: boolean;

  isCancelledByNutritionist!: boolean;

  createdAt!: string;

  updatedAt!: string;
}
