import { Currency } from "@/constants/common/currency.constants";
import {
  SessionPricingType,
  SessionType,
} from "@/constants/common/session.constants";

export interface CreateNutriSessionPricingDTO {
  amount: number;
  currency: Currency;
}

export interface CreateNutriSessionDTO {
  title: string;
  description: string;
  type: SessionType;
  pricingType: SessionPricingType;
  pricing?: CreateNutriSessionPricingDTO;
  scheduledAt: string;
  duration: number;
  maxParticipants: number;
}
