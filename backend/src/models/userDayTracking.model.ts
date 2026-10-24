import { Schema, Types, model } from "mongoose";

export enum UserDayTrackingStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  MISSED = "missed",
  SKIPPED = "skipped",
}

export interface IUserDayTracking {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  userProgramDayId: Types.ObjectId;
  dayNumber: number;
  date: Date;
  status: UserDayTrackingStatus;
  startedAt?: Date | null;
  completedAt?: Date | null;
  lastActivityAt?: Date | null;
  totalActivities: number;
  completedActivities: number;
  skippedActivities: number;
  isLocked: boolean;
  userNotes?: string;
  nutritionistNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserDayTrackingSchema = new Schema<IUserDayTracking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userProgramId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgram",
      required: true,
    },

    userProgramDayId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgramDay",
      required: true,
    },

    dayNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(UserDayTrackingStatus),
      required: true,
      default: UserDayTrackingStatus.NOT_STARTED,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    lastActivityAt: {
      type: Date,
      default: null,
    },

    totalActivities: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedActivities: {
      type: Number,
      default: 0,
      min: 0,
    },

    skippedActivities: {
      type: Number,
      default: 0,
      min: 0,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    userNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    nutritionistNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  },
);

UserDayTrackingSchema.index(
  { userProgramId: 1, dayNumber: 1 },
  { unique: true },
);

UserDayTrackingSchema.index({ userId: 1, date: -1 });
UserDayTrackingSchema.index({ userId: 1, status: 1 });

export const UserDayTrackingModel = model<IUserDayTracking>(
  "UserDayTracking",
  UserDayTrackingSchema,
);
