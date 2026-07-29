import { Schema, model, Types } from "mongoose";

export enum UserWorkoutTrackingStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  PARTIALLY_COMPLETED = "partially_completed",
  SKIPPED = "skipped",
}

export enum WorkoutDifficulty {
  VERY_EASY = "very_easy",
  EASY = "easy",
  MODERATE = "moderate",
  HARD = "hard",
  VERY_HARD = "very_hard",
}

export interface IUserWorkoutTracking {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  userProgramId: Types.ObjectId;

  userProgramDayId: Types.ObjectId;

  userDayTrackingId: Types.ObjectId;

  workoutId: Types.ObjectId;

  status: UserWorkoutTrackingStatus;

  actualStartTime?: Date;

  actualEndTime?: Date;

  completedAt?: Date;

  completedDurationMinutes?: number;

  caloriesBurned?: number;

  perceivedDifficulty?: WorkoutDifficulty;

  skippedReason?: string;

  notes?: string;

  createdAt: Date;

  updatedAt: Date;
}

const UserWorkoutTrackingSchema = new Schema<IUserWorkoutTracking>(
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

    workoutId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(UserWorkoutTrackingStatus),
      default: UserWorkoutTrackingStatus.NOT_STARTED,
      index: true,
    },

    actualStartTime: {
      type: Date,
    },

    actualEndTime: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    completedDurationMinutes: {
      type: Number,
      min: 0,
    },

    caloriesBurned: {
      type: Number,
      min: 0,
    },

    perceivedDifficulty: {
      type: String,
      enum: Object.values(WorkoutDifficulty),
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
  },
  {
    timestamps: true,
  },
);

/**
 * One tracking record per planned workout.
 */
UserWorkoutTrackingSchema.index(
  {
    userProgramDayId: 1,
    workoutId: 1,
  },
  {
    unique: true,
  },
);

/**
 * User workout history.
 */
UserWorkoutTrackingSchema.index({
  userId: 1,
  completedAt: -1,
});

/**
 * Nutritionist dashboard.
 */
UserWorkoutTrackingSchema.index({
  userProgramId: 1,
  status: 1,
});

export const UserWorkoutTrackingModel = model<IUserWorkoutTracking>(
  "UserWorkoutTracking",
  UserWorkoutTrackingSchema,
);