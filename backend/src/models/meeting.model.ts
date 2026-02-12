import { Schema, model, Document, Types } from "mongoose";

export type MeetingStatus =
  | "scheduled"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface IMeeting extends Document {
  _id:Types.ObjectId;
  title: string;
  nutritionistId: Types.ObjectId;
  userId: Types.ObjectId;
  roomId: string;
  scheduledAt: Date;
  status: MeetingStatus;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const meetingSchema = new Schema<IMeeting>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    roomId: {
      type: String,
      required: true,
      unique: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },

    startedAt: {
      type: Date,
    },

    endedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const MeetingModel = model<IMeeting>("Meeting", meetingSchema);
