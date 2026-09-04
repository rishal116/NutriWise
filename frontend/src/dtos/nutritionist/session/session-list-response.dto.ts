import {
  SessionCurrency,
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "@/types/nutritionist/session/session.types";

export interface NutriSessionListResponseDTO {
  sessionId: string;
  title: string;
  description: string;
  type: SessionType;
  pricing: {
    type: SessionPricingType;
    amount: number;
    currency: SessionCurrency;
  };
  scheduledAt: string;
  durationInMinutes: number;
  maxParticipants: number;
  thumbnailUrl?: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}
