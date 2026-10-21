import {
  MeetingCancelledBy,
  MeetingStatus,
} from "../../../models/meeting.model";

export class MeetingDetailsResponseDTO {
  id!: string;
  title!: string;
  nutritionistId!: string;
  user!: {
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
