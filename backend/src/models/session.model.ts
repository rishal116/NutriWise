import { Schema, model, Types, Document } from "mongoose";

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

export interface ISession extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;

  nutritionistId: Types.ObjectId;

  roomId: string; // video room id

  type: SessionType; // free / paid
  price?: number; // only for paid

  scheduledAt: Date;
  durationInMinutes: number;

  status: SessionStatus;

  maxParticipants?: number;

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
    },

    type: {
      type: String,
      enum: Object.values(SessionType),
      required: true,
    },

    price: {
      type: Number,
      default: 0,
      
    },

    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },

    durationInMinutes: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.SCHEDULED,
    },

    maxParticipants: {
      type: Number,
      default: 100,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const SessionModel = model<ISession>("Session", sessionSchema);
