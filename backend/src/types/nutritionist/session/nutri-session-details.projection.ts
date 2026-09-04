import { Types } from "mongoose";
import {
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "../../../models/session.model";
import { Currency } from "../../../constants/currency.constants";

export interface INutriSessionDetailsProjection {
  sessionId: Types.ObjectId;
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
  roomId: string;
  thumbnailUrl?: string;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
}
