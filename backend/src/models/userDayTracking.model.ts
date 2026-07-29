import { Schema, model, Types } from "mongoose";

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

  trackingDate: Date;

  status: UserDayTrackingStatus;

  startedAt?: Date;

  completedAt?: Date;

  mealCompletionPercentage: number;

  workoutCompletionPercentage: number;

  habitCompletionPercentage: number;

  overallCompletionPercentage: number;

  adherenceScore: number;

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

    dayNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    trackingDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(UserDayTrackingStatus),
      default: UserDayTrackingStatus.NOT_STARTED,
      index: true,
    },

    startedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    mealCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    workoutCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    habitCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    overallCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    adherenceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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

/**
 * One tracking document per user per program day.
 */
UserDayTrackingSchema.index(
  {
    userProgramId: 1,
    dayNumber: 1,
  },
  {
    unique: true,
  },
);

/**
 * User dashboard.
 */
UserDayTrackingSchema.index({
  userId: 1,
  status: 1,
});

/**
 * Program progress.
 */
UserDayTrackingSchema.index({
  userProgramId: 1,
  trackingDate: 1,
});

/**
 * Calendar view.
 */
UserDayTrackingSchema.index({
  userId: 1,
  trackingDate: -1,
});

export const UserDayTrackingModel = model<IUserDayTracking>(
  "UserDayTracking",
  UserDayTrackingSchema,
);