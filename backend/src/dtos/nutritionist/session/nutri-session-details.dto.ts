import type { Currency } from "../../../constants/common/currency.constants";
import type {
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "../../../constants/common/session.constants";

export interface NutriSessionDetailsResponseDTO {
  sessionId: string;
  title: string;
  description: string;
  type: SessionType;
  pricingType: SessionPricingType;
  pricing?: {
    amount: number;
    currency: Currency;
  };
  scheduledAt: Date;
  duration: number;
  endTime?: Date;
  maxParticipants: number;
  roomId: string;
  thumbnailUrl?: string;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
}