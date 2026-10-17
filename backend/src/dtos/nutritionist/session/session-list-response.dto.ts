import type { Currency } from "../../../constants/currency.constants";
import type {
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "../../../models/session.model";

export interface NutriSessionListResponseDTO {
  sessionId: string;
  title: string;
  type: SessionType;
  pricing: {
    type: SessionPricingType;
    amount: number;
    currency: Currency;
  };
  scheduledAt: Date;
  durationInMinutes: number;
  thumbnailUrl?: string;
  status: SessionStatus;
  registeredCount: number;
  createdAt: Date;
}
