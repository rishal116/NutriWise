import { Currency } from "@/constants/common/currency.constants";
import {
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "@/constants/common/session.constants";

export interface PublicSessionListItemResponseDTO {
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
  nutritionist: {
    nutritionistId: string;
    name: string;
    profileImage?: string;
  };
}
