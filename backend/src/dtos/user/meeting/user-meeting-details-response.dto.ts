import { MeetingStatus, MeetingType } from "../../../models/meeting.model";

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

  scheduledAt!: Date;

  durationInMinutes!: number;

  status!: MeetingStatus;

  type!: MeetingType;

  startedAt?: Date;

  endedAt?: Date;

  nutritionistJoinedAt?: Date;

  userJoinedAt?: Date;

  isCancelledByUser!: boolean;

  isCancelledByNutritionist!: boolean;

  createdAt!: Date;

  updatedAt!: Date;
}