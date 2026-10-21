import { Schema, model, Types } from "mongoose";

export enum MeetingStatus {
  SCHEDULED = "scheduled",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export const MIN_MEETING_DURATION = 30;
export const MAX_MEETING_DURATION = 60;

export enum MeetingCancelledBy {
  USER = "user",
  NUTRITIONIST = "nutritionist",
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
  startedAt?: Date;
  endedAt?: Date;
  cancelledBy?: MeetingCancelledBy;
  cancellationReason?: string;
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
      immutable: true,
      trim: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    durationInMinutes: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(MeetingStatus),
      required: true,
      default: MeetingStatus.SCHEDULED,
    },

    startedAt: {
      type: Date,
    },

    endedAt: {
      type: Date,
    },

    cancelledBy: {
      type: String,
      enum: Object.values(MeetingCancelledBy),
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
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
