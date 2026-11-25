import { Types } from "mongoose";
import type { Currency } from "../../../constants/common/currency.constants";
import type {
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "../../../constants/common/session.constants";

export interface INutriSessionListItemProjection {
  sessionId: Types.ObjectId;
  title: string;
  type: SessionType;
  pricingType: SessionPricingType;
  pricing?: {
    amount: number;
    currency: Currency;
  };
  scheduledAt: Date;
  duration: number;
  endTime?: Date;
  thumbnailUrl?: string;
  status: SessionStatus;
  participantCount: number;
}

export interface INutriSessionListItemCursorProjection extends INutriSessionListItemProjection {
  cursorId: Types.ObjectId;
  cursorValue: Date;
}
