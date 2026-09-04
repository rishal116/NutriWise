import {
  SessionCurrency,
  SessionPricingType,
  SessionType,
} from "@/types/nutritionist/session/session.types";

export interface CreateNutriSessionPricingDTO {
  type: SessionPricingType;
  amount: number;
  currency: SessionCurrency;
}

export interface CreateNutriSessionDTO {
  title: string;
  description: string;
  type: SessionType;
  pricing: CreateNutriSessionPricingDTO;
  scheduledAt: string;
  durationInMinutes: number;
  maxParticipants: number;
}
