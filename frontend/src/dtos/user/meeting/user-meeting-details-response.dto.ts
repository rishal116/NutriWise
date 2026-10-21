import { MeetingCancelledBy, MeetingStatus } from "@/enums/user/meeting/user-meeting.enum";

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
  startedAt?: string;
  endedAt?: string;
  cancelledBy?: MeetingCancelledBy;
  cancellationReason?: string;
  createdAt!: string;
  updatedAt!: string;
}