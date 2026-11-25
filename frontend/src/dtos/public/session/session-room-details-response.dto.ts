import type {
  SessionStatus,
  SessionType,
} from "@/constants/common/session.constants";

export interface SessionRoomDetailsResponseDTO {
  sessionId: string;
  title: string;
  description: string;
  type: SessionType;
  status: SessionStatus;
  scheduledAt: Date;
  duration: number;
  nutritionist: {
    nutritionistId: string;
    name: string;
    profileImage?: string;
  };
}