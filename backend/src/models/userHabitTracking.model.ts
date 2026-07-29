import { Schema, model, Types } from "mongoose";

export enum UserHabitTrackingStatus {
  NOT_STARTED = "not_started",
  COMPLETED = "completed",
  SKIPPED = "skipped",
}

export interface IUserHabitTracking {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  userProgramId: Types.ObjectId;

  userProgramDayId: Types.ObjectId;

  userDayTrackingId: Types.ObjectId;

  habitId: Types.ObjectId;

  status: UserHabitTrackingStatus;

  actualValue?: number;

  completedAt?: Date;

  skippedReason?: string;

  notes?: string;

  createdAt: Date;

  updatedAt: Date;
}

const UserHabitTrackingSchema = new Schema<IUserHabitTracking>(
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

    habitId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(UserHabitTrackingStatus),
      default: UserHabitTrackingStatus.NOT_STARTED,
      index: true,
    },

    actualValue: {
      type: Number,
      min: 0,
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
  },
  {
    timestamps: true,
  },
);

/**
 * One tracking record per planned habit.
 */
UserHabitTrackingSchema.index(
  {
    userProgramDayId: 1,
    habitId: 1,
  },
  {
    unique: true,
  },
);

/**
 * User history.
 */
UserHabitTrackingSchema.index({
  userId: 1,
  completedAt: -1,
});

/**
 * Nutritionist dashboard.
 */
UserHabitTrackingSchema.index({
  userProgramId: 1,
  status: 1,
});

export const UserHabitTrackingModel = model<IUserHabitTracking>(
  "UserHabitTracking",
  UserHabitTrackingSchema,
);