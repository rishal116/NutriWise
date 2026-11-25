import { Currency } from "@/constants/common/currency.constants";
import {
  SessionPricingType,
  SessionType,
} from "@/constants/common/session.constants";

export interface UpdateSessionPricingDTO {
  amount: number;
  currency: Currency;
}

export interface UpdateNutriSessionDTO {
  title?: string;
  description?: string;
  type?: SessionType;
  pricingType?: SessionPricingType;
  pricing?: UpdateSessionPricingDTO;
  scheduledAt?: string;
  duration?: number;
  maxParticipants?: number;
}
