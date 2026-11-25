import type {
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "../../../constants/common/session.constants";
import type { ISessionPricing } from "../../../models/session.model";

export interface IPublicSessionNutritionist {
  nutritionistId: string;
  name: string;
  profileImage?: string;
}

export interface IPublicSessionProjection {
  sessionId: string;
  title: string;
  description: string;
  type: SessionType;
  pricingType: SessionPricingType;
  pricing?: ISessionPricing;
  scheduledAt: Date;
  duration: number;
  maxParticipants: number;
  participantCount: number;
  thumbnailUrl?: string;
  status: SessionStatus;
  nutritionist: IPublicSessionNutritionist;
}

export interface IPublicSessionCursorProjection {
  item: IPublicSessionProjection;
  cursorId: string;
  cursorValue: string | number | Date;
}
