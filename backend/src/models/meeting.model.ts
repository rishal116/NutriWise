import { Schema, model, Types, Document } from "mongoose";

export enum MeetingStatus {
  SCHEDULED = "scheduled",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum MeetingType {
  VIDEO = "video",
  AUDIO = "audio",
}

export interface IMeeting extends Document {
  _id: Types.ObjectId;
  title: string;
  nutritionistId: Types.ObjectId;
  userId: Types.ObjectId;
  roomId: string;
  scheduledAt: Date;
  durationInMinutes: number;
  status: MeetingStatus;
  type: MeetingType;
  startedAt?: Date;
  endedAt?: Date;
  nutritionistJoinedAt?: Date;
  userJoinedAt?: Date;
  isCancelledByUser: boolean;
  isCancelledByNutritionist: boolean;
  isDeleted: boolean;
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
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    roomId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
      enum: Object.values(MeetingStatus),
      default: MeetingStatus.SCHEDULED,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(MeetingType),
      default: MeetingType.VIDEO,
    },
    startedAt: Date,
    endedAt: Date,
    nutritionistJoinedAt: Date,
    userJoinedAt: Date,

    isCancelledByUser: {
      type: Boolean,
      default: false,
    },

    isCancelledByNutritionist: {
      type: Boolean,
      default: false,
    },
    
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MeetingModel = model<IMeeting>("Meeting", meetingSchema);
