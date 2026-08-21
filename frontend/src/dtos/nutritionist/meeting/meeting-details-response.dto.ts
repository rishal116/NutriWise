import {
  MeetingStatus,
  MeetingType,
} from "@/enums/nutritionist/meeting/meeting.enum";

export interface MeetingDetailsResponseDTO {
  id: string;
  title: string;
  nutritionistId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage:string
  };
  roomId: string;
  scheduledAt: string;
  durationInMinutes: number;
  status: MeetingStatus;
  type: MeetingType;
  startedAt?: string;
  endedAt?: string;
  nutritionistJoinedAt?: string;
  userJoinedAt?: string;
  isCancelledByUser: boolean;
  isCancelledByNutritionist: boolean;
  createdAt: string;
  updatedAt: string;
}
