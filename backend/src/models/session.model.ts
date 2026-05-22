import { Schema, model, Types } from "mongoose";

export enum SessionType {
  FREE = "free",
  PAID = "paid",
}

export enum SessionStatus {
  SCHEDULED = "scheduled",
  LIVE = "live",
  ENDED = "ended",
  CANCELLED = "cancelled",
}

export interface ISession {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  nutritionistId: Types.ObjectId;
  roomId: string;
  type: SessionType;
  price?: number;
  scheduledAt: Date;
  durationInMinutes: number;
  status: SessionStatus;
  maxParticipants: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(SessionType),
      required: true,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
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

    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.SCHEDULED,
      index: true,
    },

    maxParticipants: {
      type: Number,
      required: true,
      default: 60,
      min: 1,
      max: 100,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SessionModel = model<ISession>("Session", sessionSchema);
