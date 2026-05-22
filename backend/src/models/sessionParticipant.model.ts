import { Schema, model, Types } from "mongoose";
import { IUserPopulated } from "../types/user.populated";

export enum SessionAccessStatus {
  PENDING = "pending",
  JOINED = "joined",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum PaymentStatus {
  NONE = "none",
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export interface ISessionParticipant {
  _id: Types.ObjectId;
  sessionId: Types.ObjectId;
  userId: Types.ObjectId | IUserPopulated;
  joinStatus: SessionAccessStatus;
  paymentStatus: PaymentStatus;
  joinedAt?: Date;
  isPresent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const sessionParticipantSchema = new Schema<ISessionParticipant>(
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

    joinStatus: {
      type: String,
      enum: Object.values(SessionAccessStatus),
      default: SessionAccessStatus.PENDING,
      required: true,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.NONE,
      required: true,
      index: true,
    },

    joinedAt: {
      type: Date,
      default: null,
    },

    isPresent: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

sessionParticipantSchema.index({ sessionId: 1, userId: 1 }, { unique: true });

sessionParticipantSchema.index({ userId: 1, createdAt: -1 });

sessionParticipantSchema.index({ sessionId: 1, joinStatus: 1 });

sessionParticipantSchema.index({ userId: 1, paymentStatus: 1 });

export const SessionParticipantModel = model<ISessionParticipant>(
  "SessionParticipant",
  sessionParticipantSchema,
);
