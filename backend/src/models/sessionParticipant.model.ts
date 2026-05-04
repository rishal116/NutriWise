import { Schema, model, Types, Document } from "mongoose";
import { PopulatedUser } from "../types/session.populated";

export enum SessionAccessStatus {
  PENDING = "pending",
  APPROVED = "approved",
}

export enum PaymentStatus {
  NONE = "none",
  PAID = "paid",
}

export interface ISessionParticipant extends Document {
  sessionId: Types.ObjectId;
  userId: Types.ObjectId | PopulatedUser;

  status: SessionAccessStatus;
  paymentStatus: PaymentStatus;

  joinedAt?: Date;
  isPresent: boolean;
}

const sessionParticipantSchema = new Schema<ISessionParticipant>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(SessionAccessStatus),
      default: SessionAccessStatus.PENDING,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.NONE,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    isPresent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const SessionParticipantModel = model<ISessionParticipant>(
  "SessionParticipant",
  sessionParticipantSchema,
);
