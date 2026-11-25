import { model, Schema, Types } from "mongoose";

import {
  CURRENCY,
  type Currency,
} from "../constants/common/currency.constants";
import {
  SESSION_TYPES,
  SESSION_PRICING_TYPES,
  SESSION_STATUSES,
  type SessionType,
  type SessionPricingType,
  type SessionStatus,
} from "../constants/common/session.constants";

export interface ISessionPricing {
  amount: number;
  currency: Currency;
}

export interface ISession {
  _id: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  title: string;
  description: string;
  type: SessionType;
  pricingType: SessionPricingType;
  pricing?: ISessionPricing;
  scheduledAt: Date;
  duration: number;
  endTime?: Date;
  maxParticipants: number;
  roomId: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  status: SessionStatus;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const sessionPricingSchema = new Schema<ISessionPricing>(
  {
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      enum: [CURRENCY],
      required: true,
      default: CURRENCY,
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
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 2000,
    },
    type: {
      type: String,
      enum: SESSION_TYPES,
      required: true,
    },
    pricingType: {
      type: String,
      enum: SESSION_PRICING_TYPES,
      required: true,
    },
    pricing: {
      type: sessionPricingSchema,
      required: function (this: ISession) {
        return this.pricingType === "paid";
      },
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 15,
      max: 180,
    },
    endTime: {
      type: Date,
      default: undefined,
    },
    maxParticipants: {
      type: Number,
      required: true,
      min: 2,
      max: 100,
    },
    roomId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    thumbnailPublicId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: SESSION_STATUSES,
      required: true,
      default: "draft",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

sessionSchema.index({
  nutritionistId: 1,
  deletedAt: 1,
  status: 1,
  scheduledAt: -1,
});

sessionSchema.index({
  deletedAt: 1,
  status: 1,
  scheduledAt: 1,
});

export const SessionModel = model<ISession>("Session", sessionSchema);
