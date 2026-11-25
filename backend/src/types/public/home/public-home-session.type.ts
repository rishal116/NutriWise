import { Currency } from "../../../constants/common/currency.constants";
import {
  SessionPricingType,
  SessionType,
} from "../../../constants/common/session.constants";

export interface PublicHomeSession {
  id: string;
  title: string;
  description?: string;
  type: SessionType;
  thumbnailUrl?: string;
  scheduledAt: Date;
  durationInMinutes: number;
  maxParticipants: number;
  pricing: {
    type: SessionPricingType;
    amount?: number;
    currency?: Currency;
  };
  nutritionist: {
    fullName: string;
    username: string;
    profileImage?: string;
  };
}
