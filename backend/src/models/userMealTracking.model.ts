import { Schema, model, Types } from "mongoose";

export enum UserMealTrackingStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  MODIFIED = "modified",
  SKIPPED = "skipped",
}

export interface IUserMealTracking {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  userProgramId: Types.ObjectId;

  userProgramDayId: Types.ObjectId;

  userDayTrackingId: Types.ObjectId;

  mealId: Types.ObjectId;

  mealType: string;

  status: UserMealTrackingStatus;

  actualMealTime?: Date;

  completedAt?: Date;

  skippedReason?: string;

  notes?: string;

  mealPhotoUrl?: string;

  nutritionistComment?: string;

  aiScore?: number;

  aiAnalysis?: string;

  createdAt: Date;

  updatedAt: Date;
}

const UserMealTrackingSchema = new Schema<IUserMealTracking>(
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
      index: true,
    },

    mealId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    mealType: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(UserMealTrackingStatus),
      default: UserMealTrackingStatus.NOT_STARTED,
      index: true,
    },

    actualMealTime: {
      type: Date,
    },

    completedAt: {
      type: Date,
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

    mealPhotoUrl: {
      type: String,
      trim: true,
    },

    nutritionistComment: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    aiScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    aiAnalysis: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * One tracking record per planned meal.
 */
UserMealTrackingSchema.index(
  {
    userProgramDayId: 1,
    mealId: 1,
  },
  {
    unique: true,
  },
);

/**
 * User history.
 */
UserMealTrackingSchema.index({
  userId: 1,
  completedAt: -1,
});

/**
 * Nutritionist dashboard.
 */
UserMealTrackingSchema.index({
  userProgramId: 1,
  status: 1,
});

export const UserMealTrackingModel = model<IUserMealTracking>(
  "UserMealTracking",
  UserMealTrackingSchema,
);