import {
  SessionStatus,
  SessionType,
} from "@/constants/common/session.constants";
import type {
  UserSessionListItemDTO,
  UserSessionPricingDTO,
} from "./user-session-list.dto";

export interface UserSessionDetailsDTO extends Omit<
  UserSessionListItemDTO,
  "session"
> {
  cancelledAt: string | null;
  attendedAt: string | null;

  session: {
    nutritionistId: string;
    title: string;
    description: string;
    type: SessionType;
    pricing: UserSessionPricingDTO;
    scheduledAt: string;
    durationInMinutes: number;
    maxParticipants: number;
    roomId: string;
    thumbnailUrl?: string;
    status: SessionStatus;
  };
}
