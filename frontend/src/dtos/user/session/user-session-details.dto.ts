
import type {
  UserSessionListItemDTO,
  UserSessionPricingDTO,
  UserSessionRegistrationStatus,
  UserSessionPaymentStatus,
  UserSessionType,
  UserSessionStatus,
} from "./user-session.dto";

export interface UserSessionDetailsDTO
  extends Omit<UserSessionListItemDTO, "session" | "cancelledAt"> {
  cancelledAt: string | null;
  attendedAt: string | null;
  session: {
    nutritionistId: string;
    title: string;
    description: string;
    type: UserSessionType;
    pricing: UserSessionPricingDTO;
    scheduledAt: string;
    durationInMinutes: number;
    maxParticipants: number;
    roomId: string;
    thumbnailUrl?: string;
    status: UserSessionStatus;
  };
}
