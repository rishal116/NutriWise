import { Schema, model, Types } from "mongoose";

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

export interface IMeeting {
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
      maxlength: 200,
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
      immutable: true,
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
      max: 480,
    },

    status: {
      type: String,
      enum: Object.values(MeetingStatus),
      required: true,
      default: MeetingStatus.SCHEDULED,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(MeetingType),
      required: true,
      default: MeetingType.VIDEO,
    },

    startedAt: {
      type: Date,
    },

    endedAt: {
      type: Date,
    },

    nutritionistJoinedAt: {
      type: Date,
    },

    userJoinedAt: {
      type: Date,
    },

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
  },
);

/**
 * Common query indexes
 */
meetingSchema.index({
  nutritionistId: 1,
  scheduledAt: 1,
  status: 1,
});

meetingSchema.index({
  userId: 1,
  scheduledAt: 1,
  status: 1,
});

meetingSchema.index({
  nutritionistId: 1,
  userId: 1,
  scheduledAt: 1,
});

export const MeetingModel = model<IMeeting>("Meeting", meetingSchema);
