import { Schema, model, Types } from "mongoose";
import {
  PROGRAM_ACTIVITY_CATEGORIES,
  ProgramActivityCategory,
} from "./userProgramDay.model";

export type CreateUserActivityTrackingData = Omit<
  IUserActivityTracking,
  "_id" | "createdAt" | "updatedAt"
>;

export enum UserActivityTrackingStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  SKIPPED = "skipped",
}

export enum ActivityTrackingValueType {
  BOOLEAN = "boolean",
  NUMBER = "number",
  DURATION = "duration",
  PHOTO = "photo",
  TEXT = "text",
}

export enum ActivityCompletedBy {
  USER = "user",
  NUTRITIONIST = "nutritionist",
  SYSTEM = "system",
}

export interface IUserActivityTracking {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  userProgramDayId: Types.ObjectId;
  userDayTrackingId: Types.ObjectId;
  activityId: Types.ObjectId;
  title: string;
  category: ProgramActivityCategory;
  status: UserActivityTrackingStatus;
  valueType: ActivityTrackingValueType;
  targetValue?: number;
  recordedValue?: number;
  unit?: string;
  actualDurationMinutes?: number;
  score?: number;
  evidence: string[];
  skippedReason?: string;
  notes?: string;
  nutritionistFeedback?: string;
  completedBy: ActivityCompletedBy;
  lastUpdatedBy: ActivityCompletedBy;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserActivityTrackingSchema = new Schema<IUserActivityTracking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userProgramId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgram",
      required: true,
      index: true,
    },

    userProgramDayId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgramDay",
      required: true,
      index: true,
    },

    userDayTrackingId: {
      type: Schema.Types.ObjectId,
      ref: "UserDayTracking",
      required: true,
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
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(UserActivityTrackingStatus),
      default: UserActivityTrackingStatus.NOT_STARTED,
      index: true,
    },

    valueType: {
      type: String,
      enum: Object.values(ActivityTrackingValueType),
      required: true,
    },

    targetValue: {
      type: Number,
      min: 0,
    },

    recordedValue: {
      type: Number,
      min: 0,
    },

    unit: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    actualDurationMinutes: {
      type: Number,
      min: 0,
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
    },

    evidence: {
      type: [String],
      default: [],
    },

    skippedReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    nutritionistFeedback: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    completedBy: {
      type: String,
      enum: Object.values(ActivityCompletedBy),
      default: ActivityCompletedBy.USER,
    },

    lastUpdatedBy: {
      type: String,
      enum: Object.values(ActivityCompletedBy),
      default: ActivityCompletedBy.USER,
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
  {
    userProgramDayId: 1,
    activityId: 1,
  },
  {
    unique: true,
  },
);
UserActivityTrackingSchema.index({
  userDayTrackingId: 1,
});
UserActivityTrackingSchema.index({
  userProgramId: 1,
  status: 1,
});
UserActivityTrackingSchema.index({
  userProgramId: 1,
  category: 1,
  status: 1,
});
UserActivityTrackingSchema.index({
  userId: 1,
  completedAt: -1,
});

export const UserActivityTrackingModel = model<IUserActivityTracking>(
  "UserActivityTracking",
  UserActivityTrackingSchema,
);
