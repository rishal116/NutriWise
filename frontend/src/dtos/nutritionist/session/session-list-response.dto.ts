import type {
  SessionCurrency,
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "@/types/nutritionist/session/session.types";

export interface NutriSessionListResponseDTO {
  sessionId: string;
  title: string;
  type: SessionType;
  pricing: {
    type: SessionPricingType;
    amount: number;
    currency: SessionCurrency;
  };
  scheduledAt: string;
  durationInMinutes: number;
  thumbnailUrl?: string;
  status: SessionStatus;
  registeredCount: number;
  createdAt: string;
}
