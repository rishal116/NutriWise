import { Schema, model, Types } from "mongoose";

export const SESSION_REGISTRATION_STATUSES = [
  "registered",
  "cancelled",
  "attended",
  "absent",
] as const;

export type SessionRegistrationStatus =
  (typeof SESSION_REGISTRATION_STATUSES)[number];

export const SESSION_REGISTRATION_PAYMENT_STATUSES = [
  "not_required",
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

export type SessionRegistrationPaymentStatus =
  (typeof SESSION_REGISTRATION_PAYMENT_STATUSES)[number];

export interface ISessionRegistration {
  _id: Types.ObjectId;
  sessionId: Types.ObjectId;
  userId: Types.ObjectId;
  status: SessionRegistrationStatus;
  paymentStatus: SessionRegistrationPaymentStatus;
  checkoutSessionId?: string;
  paymentIntentId?: string;
  registeredAt: Date;
  cancelledAt?: Date | null;
  attendedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const SessionRegistrationSchema = new Schema<ISessionRegistration>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: SESSION_REGISTRATION_STATUSES,
      required: true,
      default: "registered",
    },

    paymentStatus: {
      type: String,
      enum: SESSION_REGISTRATION_PAYMENT_STATUSES,
      required: true,
      default: "not_required",
    },

    checkoutSessionId: {
      type: String,
    },

    paymentIntentId: {
      type: String,
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
    collection: "sessionregistrations",
  },
);

SessionRegistrationSchema.index({ sessionId: 1, userId: 1 }, { unique: true });

SessionRegistrationSchema.index({
  sessionId: 1,
  status: 1,
  paymentStatus: 1,
});

SessionRegistrationSchema.index({ userId: 1 });

SessionRegistrationSchema.index(
  { checkoutSessionId: 1 },
  { unique: true, sparse: true },
);

SessionRegistrationSchema.index(
  { paymentIntentId: 1 },
  { unique: true, sparse: true },
);

export const SessionRegistrationModel = model<ISessionRegistration>(
  "SessionRegistration",
  SessionRegistrationSchema,
);
