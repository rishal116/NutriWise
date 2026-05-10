import { Schema, model, Document, Types } from "mongoose";
import {
  ActivityLevel,
  FitnessLevel,
  DietType,
  GoalType,
  TimelineType,
  ACTIVITY_LEVELS,
  FITNESS_LEVELS,
  DIET_TYPES,
  GOALS,
  TIMELINES,
} from "../types/health.types";

export type Gender = "male" | "female" | "other";

export interface IClientProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  dateOfBirth?: Date;
  gender?: Gender;

  heightCm: number;
  weightKg: number;

  activityLevel: ActivityLevel;
  fitnessLevel: FitnessLevel;
  dietType: DietType;

  allergies?: string[];
  dietaryRestrictions?: string[];
  medicalConditions?: string[];
  injuries?: string[];

  dailyWaterIntakeLiters: number;
  sleepDurationHours: number;

  dailyStepGoal?: number;
  workoutDaysPerWeek?: number;
  workoutTimePerSession?: number;

  goal: GoalType;
  targetWeightKg?: number;
  preferredTimeline: TimelineType;
  customTimelineWeeks?: number;

  focusAreas?: string[];

  profileCompleted: boolean;
  profileCompletionPercentage?: number;

  createdAt: Date;
  updatedAt: Date;
}

const clientProfileSchema = new Schema<IClientProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    heightCm: {
      type: Number,
      required: true,
    },
    weightKg: {
      type: Number,
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ACTIVITY_LEVELS,
      required: true,
    },
    fitnessLevel: {
      type: String,
      enum: FITNESS_LEVELS,
      required: true,
      default: "beginner",
    },
    dietType: {
      type: String,
      enum: DIET_TYPES,
      required: true,
    },
    allergies: [{ type: String }],
    dietaryRestrictions: [{ type: String }],
    medicalConditions: [{ type: String }],
    injuries: [{ type: String }],
    dailyWaterIntakeLiters: {
      type: Number,
      required: true,
    },
    sleepDurationHours: {
      type: Number,
      required: true,
    },
    dailyStepGoal: {
      type: Number,
    },
    workoutDaysPerWeek: {
      type: Number,
    },
    workoutTimePerSession: {
      type: Number,
    },
    goal: {
      type: String,
      enum: GOALS,
      required: true,
    },
    targetWeightKg: {
      type: Number,
    },
    preferredTimeline: {
      type: String,
      enum: TIMELINES,
      required: true,
    },
    customTimelineWeeks: {
      type: Number,
      min: 1,
    },
    focusAreas: [{ type: String }],
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    profileCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
);

export const ClientProfileModel = model<IClientProfile>(
  "ClientProfile",
  clientProfileSchema,
);
