import { Schema, model, Types } from "mongoose";

/* =========================
   ENUMS
========================= */

export const PROGRAM_STATUS = [
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
] as const;

export const PROGRAM_GOALS = [
  "weight_loss",
  "weight_gain",
  "muscle_gain",
  "fat_loss",
  "maintenance",
  "diabetes_control",
  "pcos_management",
  "thyroid_support",
  "heart_health",
  "general_wellness",
] as const;

export type ProgramStatus = typeof PROGRAM_STATUS[number];
export type ProgramGoal = typeof PROGRAM_GOALS[number];

/* =========================
   INTERFACE
========================= */

export interface IUserProgram {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  userPlanId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  goal: string;
  focusAreas?: string[];
  dietType?: string;
  activityLevel?: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  currentDay: number;
  completionPercentage: number;
  status: ProgramStatus;
  pausedAt?: Date;
  pauseReason?: string;
  notes?: string;
  healthProfileSnapshot?: {
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
    medicalConditions?: string[];
    allergies?: string[];
  };
  planSnapshot?: {
    title?: string;
    price?: number;
    currency?: string;
    durationInDays?: number;
  };
  isDeleted:boolean;
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

    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
      index: true,
    },

    userPlanId: {
      type: Schema.Types.ObjectId,
      ref: "UserPlan",
      required: true,
      index: true,
    },

    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    goal: {
      type: String,
      required: true,
      index: true,
    },

    focusAreas: {
      type:[{ type: String }],
    },
    dietType: String,
    activityLevel: String,

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
      default: "ACTIVE",
      index: true,
    },

    pausedAt: Date,
    pauseReason: String,

    notes: String,

    healthProfileSnapshot: {
      age: Number,
      gender: String,
      height: Number,
      weight: Number,
      medicalConditions: [String],
      allergies: [String],
    },
    planSnapshot : {
      title: String,
      price: Number,
      currency: String,
      durationInDays: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    }
  },

  { timestamps: true }
);



UserProgramSchema.index({ userId: 1, status: 1 });
UserProgramSchema.index({ nutritionistId: 1, status: 1 });
UserProgramSchema.index({ userId: 1, startDate: -1 });


export const UserProgramModel = model<IUserProgram>(
  "UserProgram",
  UserProgramSchema
);