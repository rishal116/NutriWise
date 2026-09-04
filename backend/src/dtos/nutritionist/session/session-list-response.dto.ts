import {
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "../../../models/session.model";

import { Currency } from "../../../constants/currency.constants";

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

  maxParticipants: number;

  thumbnailUrl?: string;

  status: SessionStatus;

  registeredCount: number;

  createdAt: Date;
}
