import { model, Schema, Types } from "mongoose";
import { CURRENCIES, Currency } from "../constants/currency.constants";

export const SESSION_TYPES = [
  "webinar",
  "workshop",
  "group_consultation",
  "qna",
  "seminar",
] as const;

export type SessionType = (typeof SESSION_TYPES)[number];

export const SESSION_PRICING_TYPES = ["free", "paid"] as const;

export type SessionPricingType = (typeof SESSION_PRICING_TYPES)[number];

export const SESSION_STATUSES = [
  "draft",
  "scheduled",
  "live",
  "completed",
  "cancelled",
] as const;

export type SessionStatus = (typeof SESSION_STATUSES)[number];

export interface ISessionPricing {
  type: SessionPricingType;
  amount: number;
  currency: Currency;
}

export interface ISession {
  _id: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  title: string;
  description: string;
  type: SessionType;
  pricing: ISessionPricing;
  scheduledAt: Date;
  durationInMinutes: number;
  maxParticipants: number;
  roomId: string;
  thumbnailUrl?: string;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const sessionPricingSchema = new Schema<ISessionPricing>(
  {
    type: {
      type: String,
      enum: SESSION_PRICING_TYPES,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    currency: {
      type: String,
      enum: CURRENCIES,
      required: true,
      default: "inr",
    },
  },
  {
    _id: false,
  },
);

const sessionSchema = new Schema<ISession>(
  {
    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    type: {
      type: String,
      enum: SESSION_TYPES,
      required: true,
      index: true,
    },

    pricing: {
      type: sessionPricingSchema,
      required: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },

    durationInMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },

    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    thumbnailUrl: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: SESSION_STATUSES,
      required: true,
      default: "draft",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

sessionSchema.index({
  nutritionistId: 1,
  status: 1,
  scheduledAt: -1,
});

sessionSchema.index({
  status: 1,
  scheduledAt: 1,
});

export const SessionModel = model<ISession>("Session", sessionSchema);
