import { Schema, Types, model } from "mongoose";

import {
  PROGRAM_ACTIVITY_CATEGORIES,
  type ProgramActivityCategory,
} from "../constants/user/program/program-activity-category.constants";

import {
  ACTIVITY_VALUE_TYPES,
  type ActivityValueType,
} from "../constants/user/program/activity-value-type.constants";

import {
  ACTIVITY_TRACKING_STATUSES,
  type ActivityTrackingStatus,
} from "../constants/user/program/activity-tracking-status.constants";

import {
  ACTIVITY_COMPLETED_BY,
  type ActivityCompletedBy,
} from "../constants/user/program/activity-completed-by.constants";

export interface IUserActivityTracking {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  userProgramDayId: Types.ObjectId;
  userDayTrackingId: Types.ObjectId | null;
  activityId: Types.ObjectId;
  title: string;
  category: ProgramActivityCategory;
  valueType: ActivityValueType;
  status: ActivityTrackingStatus;
  recordedValue?: number;
  recordedText?: string;
  unit?: string;
  evidence: string[];
  skippedReason?: string;
  notes?: string;
  nutritionistFeedback?: string;
  lastUpdatedBy: ActivityCompletedBy;
  startedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserActivityTrackingData = Omit<
  IUserActivityTracking,
  "_id" | "createdAt" | "updatedAt"
>;

const UserActivityTrackingSchema = new Schema<IUserActivityTracking>(
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

    userDayTrackingId: {
      type: Schema.Types.ObjectId,
      ref: "UserDayTracking",
      default: null,
    },

    activityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    category: {
      type: String,
      enum: PROGRAM_ACTIVITY_CATEGORIES,
      required: true,
    },

    valueType: {
      type: String,
      enum: ACTIVITY_VALUE_TYPES,
      required: true,
    },

    status: {
      type: String,
      enum: ACTIVITY_TRACKING_STATUSES,
      required: true,
      default: "not_started",
    },

    recordedValue: {
      type: Number,
      min: 0,
    },

    recordedText: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    unit: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    evidence: {
      type: [String],
      default: [],
      validate: {
        validator: (items: string[]) => items.length <= 10,
        message: "Maximum 10 evidence attachments are allowed.",
      },
    },

    skippedReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    nutritionistFeedback: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    lastUpdatedBy: {
      type: String,
      enum: ACTIVITY_COMPLETED_BY,
      required: true,
      default: "user",
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

UserActivityTrackingSchema.index(
  { userProgramDayId: 1, activityId: 1 },
  { unique: true },
);

export const UserActivityTrackingModel = model<IUserActivityTracking>(
  "UserActivityTracking",
  UserActivityTrackingSchema,
);
