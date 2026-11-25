import type {
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "../../../constants/common/session.constants";
import type { Currency } from "../../../constants/common/currency.constants";

export interface IPublicSessionNutritionistResponseDTO {
  nutritionistId: string;
  name: string;
  profileImage?: string;
}

export interface PublicSessionDetailsResponseDTO {
  sessionId: string;
  title: string;
  description: string;
  type: SessionType;
  pricing: {
    type: SessionPricingType;
    amount?: number;
    currency?: Currency;
  };
  scheduledAt: string;
  duration: number;
  maxParticipants: number;
  participantCount: number;
  thumbnailUrl?: string;
  status: SessionStatus;
  isRegistered: boolean;
  nutritionist: IPublicSessionNutritionistResponseDTO;
}
