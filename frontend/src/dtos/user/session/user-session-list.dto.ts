import type { SessionRegistrationStatus } from "@/constants/common/session-registration.constants";
import type {
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "@/constants/common/session.constants";

export interface UserSessionPricingDTO {
  type: SessionPricingType;
  amount?: number;
  currency?: string;
}

export interface UserSessionListItemDTO {
  registrationId: string;
  sessionId: string;
  registrationStatus: SessionRegistrationStatus;
  registeredAt: string;
  session: {
    title: string;
    type: SessionType;
    pricing: UserSessionPricingDTO;
    scheduledAt: string;
    durationInMinutes: number;
    thumbnailUrl?: string;
    status: SessionStatus;
  };
}
