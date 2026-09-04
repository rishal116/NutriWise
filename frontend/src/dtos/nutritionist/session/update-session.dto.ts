import {
  SessionCurrency,
  SessionPricingType,
  SessionType,
} from "@/types/nutritionist/session/session.types";

export interface UpdateSessionPricingDTO {
  type: SessionPricingType;
  amount: number;
  currency: SessionCurrency;
}

export interface UpdateNutriSessionDTO {
  title?: string;
  description?: string;
  type?: SessionType;
  pricing?: UpdateSessionPricingDTO;
  scheduledAt?: string;
  durationInMinutes?: number;
  maxParticipants?: number;
  thumbnailUrl?: string;
}
