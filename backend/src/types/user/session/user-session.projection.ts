import type { Types } from "mongoose";

import type {
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "../../../models/session.model";

import type {
  SessionRegistrationPaymentStatus,
  SessionRegistrationStatus,
} from "../../../models/sessionRegistration.model";

export interface IUserSessionListProjection {
  registrationId: Types.ObjectId;
  sessionId: Types.ObjectId;
  registrationStatus: SessionRegistrationStatus;
  paymentStatus: SessionRegistrationPaymentStatus;
  registeredAt: Date;
  session: {
    title: string;
    type: SessionType;
    pricing: {
      type: SessionPricingType;
      amount: number;
      currency: string;
    };
    scheduledAt: Date;
    durationInMinutes: number;
    thumbnailUrl?: string;
    status: SessionStatus;
  };
}

export interface IUserSessionDetailsProjection {
  registrationId: Types.ObjectId;
  sessionId: Types.ObjectId;
  registrationStatus: SessionRegistrationStatus;
  paymentStatus: SessionRegistrationPaymentStatus;
  registeredAt: Date;
  cancelledAt: Date | null;
  attendedAt: Date | null;
  session: {
    nutritionistId: Types.ObjectId;
    title: string;
    description: string;
    type: SessionType;
    pricing: {
      type: SessionPricingType;
      amount: number;
      currency: string;
    };
    scheduledAt: Date;
    durationInMinutes: number;
    maxParticipants: number;
    roomId: string;
    thumbnailUrl?: string;
    status: SessionStatus;
  };
}
