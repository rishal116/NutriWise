import {
  MeetingCancelledBy,
  MeetingStatus,
} from "../../../models/meeting.model";

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
  startedAt?: Date;
  endedAt?: Date;
  cancelledBy?: MeetingCancelledBy;
  cancellationReason?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
