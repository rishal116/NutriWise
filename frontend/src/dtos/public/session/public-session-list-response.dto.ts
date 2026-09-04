import {
  SessionCurrency,
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "@/types/public/session/session.types";

export interface PublicSessionListItemResponseDTO {
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

  nutritionist: {
    nutritionistId: string;
    name: string;
    profileImage?: string;
  };
}
