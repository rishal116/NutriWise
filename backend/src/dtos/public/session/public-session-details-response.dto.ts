import {
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "../../../models/session.model";
import { Currency } from "../../../constants/currency.constants";

export interface PublicSessionDetailsResponseDTO {
  sessionId: string;
  title: string;
  description: string;
  type: SessionType;
  pricing: {
    type: SessionPricingType;
    amount: number;
    currency: Currency;
  };
  scheduledAt: Date;
  durationInMinutes: number;
  maxParticipants: number;
  thumbnailUrl?: string;
  status: SessionStatus;
  nutritionist: {
    nutritionistId: string;
    name: string;
    profileImage?: string;
    bio?: string;
  };
  createdAt: Date;
}
