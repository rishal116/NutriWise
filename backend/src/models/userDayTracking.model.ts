import { Schema, Types, model } from "mongoose";

import {
  DAY_TRACKING_STATUSES,
  type DayTrackingStatus,
  UserDayTrackingStatus,
} from "../constants/user/program/day-tracking-status.constants";

export {
  DAY_TRACKING_STATUSES,
  type DayTrackingStatus,
  UserDayTrackingStatus,
};

export interface IUserDayTracking {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  userProgramDayId: Types.ObjectId;
  dayNumber: number;
  date: Date;
  status: DayTrackingStatus;
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
      validate: {
        validator: Number.isInteger,
        message: "Day number must be an integer",
      },
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: DAY_TRACKING_STATUSES,
      required: true,
      default: "not_started",
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
      validate: {
        validator: Number.isInteger,
        message: "Total activities must be an integer",
      },
    },

    completedActivities: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Completed activities must be an integer",
      },
    },

    skippedActivities: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Skipped activities must be an integer",
      },
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