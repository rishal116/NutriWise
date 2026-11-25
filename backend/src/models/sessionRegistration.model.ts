import { Schema, model, Types } from "mongoose";
import {
  SESSION_REGISTRATION_STATUSES,
  SessionRegistrationStatus,
} from "../constants/common/session-registration.constants";

export interface ISessionRegistration {
  _id: Types.ObjectId;
  sessionId: Types.ObjectId;
  userId: Types.ObjectId;
  status: SessionRegistrationStatus;
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

    registeredAt: {
      type: Date,
      required: true,
      default: Date.now,
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

SessionRegistrationSchema.index({ sessionId: 1, userId: 1 }, { unique: true });

SessionRegistrationSchema.index({ sessionId: 1, status: 1 });

SessionRegistrationSchema.index({ userId: 1 });

export const SessionRegistrationModel = model<ISessionRegistration>(
  "SessionRegistration",
  SessionRegistrationSchema,
);
