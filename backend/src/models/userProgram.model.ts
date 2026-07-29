import { Schema, model, Types } from "mongoose";

export const PROGRAM_STATUS = [
  "upcoming",
  "active",
  "paused",
  "completed",
  "cancelled",
] as const;
export type ProgramStatus = (typeof PROGRAM_STATUS)[number];

export interface IUserProgram {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  userPlanId: Types.ObjectId;
  planId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  currentDay: number;
  completionPercentage: number;
  status: ProgramStatus;
  pausedAt?: Date;
  resumedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  notes?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserProgramSchema = new Schema<IUserProgram>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userPlanId: {
      type: Schema.Types.ObjectId,
      ref: "UserPlan",
      required: true,
      unique: true,
      index: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "NutritionistPlan",
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },
    currentDay: {
      type: Number,
      default: 1,
      min: 1,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: PROGRAM_STATUS,
      default: "upcoming",
      index: true,
    },
    pausedAt: {
      type: Date,
      default: null,
    },
    resumedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

UserProgramSchema.index({
  userId: 1,
  status: 1,
  isDeleted: 1,
});
UserProgramSchema.index({
  nutritionistId: 1,
  status: 1,
  isDeleted: 1,
});
UserProgramSchema.index({
  startDate: 1,
  endDate: 1,
});

export const UserProgramModel = model<IUserProgram>(
  "UserProgram",
  UserProgramSchema,
);
