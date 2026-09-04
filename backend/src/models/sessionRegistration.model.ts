import { Schema, model, Types } from "mongoose";

export const SESSION_REGISTRATION_STATUS = [
  "registered",
  "cancelled",
  "attended",
  "absent",
] as const;

export type SessionRegistrationStatus =
  (typeof SESSION_REGISTRATION_STATUS)[number];

export const SESSION_REGISTRATION_PAYMENT_STATUS = [
  "not_required",
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

export type SessionRegistrationPaymentStatus =
  (typeof SESSION_REGISTRATION_PAYMENT_STATUS)[number];

export interface ISessionRegistration {
  _id: Types.ObjectId;

  sessionId: Types.ObjectId;

  userId: Types.ObjectId;

  status: SessionRegistrationStatus;

  paymentStatus: SessionRegistrationPaymentStatus;

  checkoutSessionId?: string;

  paymentIntentId?: string;

  registeredAt: Date;

  cancelledAt?: Date;

  attendedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const SessionRegistrationSchema = new Schema<ISessionRegistration>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: SESSION_REGISTRATION_STATUS,
      required: true,
      default: "registered",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: SESSION_REGISTRATION_PAYMENT_STATUS,
      required: true,
      default: "not_required",
      index: true,
    },

    checkoutSessionId: {
      type: String,
      default: null,
      sparse: true,
      index: true,
    },

    paymentIntentId: {
      type: String,
      default: null,
      sparse: true,
      index: true,
    },

    registeredAt: {
      type: Date,
      required: true,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    attendedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

SessionRegistrationSchema.index(
  {
    sessionId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);

export const SessionRegistrationModel = model<ISessionRegistration>(
  "SessionRegistration",
  SessionRegistrationSchema,
);
