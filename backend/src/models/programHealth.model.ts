import { Schema, Types, model } from "mongoose";

import {
  ACTIVITY_LEVELS,
  DIET_TYPES,
  type ActivityLevel,
  type DietType,
} from "../types/health.types";

export interface IProgramHealth {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  healthDetailsId?: Types.ObjectId;

  heightCm: number;
  currentWeightKg: number;
  targetWeightKg?: number;

  activityLevel: ActivityLevel;
  dietType: DietType;

  medicalConditions: string[];
  allergies: string[];
  dietaryRestrictions: string[];

  foodPreferences: string[];
  dislikedFoods: string[];

  mealsPerDay?: number;
  dailyWaterIntakeLiters?: number;
  averageSleepHours?: number;

  additionalNotes?: string;

  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramHealthSchema = new Schema<IProgramHealth>(
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

    healthDetailsId: {
      type: Schema.Types.ObjectId,
      ref: "HealthDetails",
    },

    heightCm: {
      type: Number,
      required: true,
      min: 1,
      max: 300,
    },

    currentWeightKg: {
      type: Number,
      required: true,
      min: 1,
      max: 700,
    },

    targetWeightKg: {
      type: Number,
      min: 1,
      max: 700,
    },

    activityLevel: {
      type: String,
      enum: ACTIVITY_LEVELS,
      required: true,
    },

    dietType: {
      type: String,
      enum: DIET_TYPES,
      required: true,
    },

    medicalConditions: {
      type: [String],
      default: [],
    },

    allergies: {
      type: [String],
      default: [],
    },

    dietaryRestrictions: {
      type: [String],
      default: [],
    },

    foodPreferences: {
      type: [String],
      default: [],
    },

    dislikedFoods: {
      type: [String],
      default: [],
    },

    mealsPerDay: {
      type: Number,
      min: 1,
      max: 10,
    },

    dailyWaterIntakeLiters: {
      type: Number,
      min: 0,
      max: 20,
    },

    averageSleepHours: {
      type: Number,
      min: 0,
      max: 24,
    },

    additionalNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

ProgramHealthSchema.index({ userProgramId: 1 }, { unique: true });

ProgramHealthSchema.index({
  userId: 1,
  submittedAt: -1,
});

export const ProgramHealthModel = model<IProgramHealth>(
  "ProgramHealth",
  ProgramHealthSchema,
);
