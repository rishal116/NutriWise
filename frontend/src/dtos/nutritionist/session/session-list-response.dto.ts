import { Currency } from "@/constants/common/currency.constants";
import {
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "@/constants/common/session.constants";

export interface NutriSessionListResponseDTO {
  sessionId: string;
  title: string;
  type: SessionType;
  pricingType: SessionPricingType;
  pricing?: {
    amount: number;
    currency: Currency;
  };
  scheduledAt: string;
  duration: number;
  endTime?: string;
  thumbnailUrl?: string;
  status: SessionStatus;
  participantCount: number;
}
