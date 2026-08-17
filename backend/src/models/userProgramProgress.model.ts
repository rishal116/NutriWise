import { Schema, model, Types } from "mongoose";

export interface IUserProgramProgress {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  totalDays: number;
  completedDays: number;
  currentDay: number;
  totalActivities: number;
  completedActivities: number;
  skippedActivities: number;
  completionPercentage: number;
  adherenceScore: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDay: number;
  lastActivityAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserProgramProgressSchema = new Schema<IUserProgramProgress>(
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
      unique: true,
      index: true,
    },

    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },

    completedDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentDay: {
      type: Number,
      default: 1,
      min: 1,
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

    completionPercentage: {
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

    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastCompletedDay: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastActivityAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

UserProgramProgressSchema.index({
  userId: 1,
  userProgramId: 1,
});
UserProgramProgressSchema.index({
  userId: 1,
  completionPercentage: -1,
});
UserProgramProgressSchema.index({
  userId: 1,
  adherenceScore: -1,
});

export const UserProgramProgressModel = model<IUserProgramProgress>(
  "UserProgramProgress",
  UserProgramProgressSchema,
);
