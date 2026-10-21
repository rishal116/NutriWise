import { MeetingStatus } from "@/enums/nutritionist/meeting/meeting.enum";

export interface MeetingDetailsResponseDTO {
  id: string;
  title: string;
  nutritionistId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };
  roomId: string;
  scheduledAt: string;
  durationInMinutes: number;
  status: MeetingStatus;
  startedAt?: string;
  endedAt?: string;
  cancelledBy?: "user" | "nutritionist";
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}
