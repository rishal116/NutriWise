import { Schema, model, Document, Types } from "mongoose";
import {
  ActivityLevel,
  FitnessLevel,
  DietType,
  GoalType,
  ACTIVITY_LEVELS,
  FITNESS_LEVELS,
  DIET_TYPES,
  GOALS,
} from "../types/health.types";
  
export interface IHealthDetails extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  height: number;
  weight: number;
  bmi?: number;
  activityLevel: ActivityLevel;
  fitnessLevel: FitnessLevel;
  dietType: DietType;
  allergies?: string[];
  dietaryRestrictions?: string[];
  medicalConditions?: string[];
  injuries?: string[];
  dailyWaterIntake: number;
  sleepDuration: number;
  dailyStepGoal?: number;
  workoutDaysPerWeek?: number;
  workoutTimePerSession?: number;
  goal: GoalType;
  targetWeight?: number;
  preferredTimeline: string;
  focusArea?: string;
  createdAt: Date;
  updatedAt: Date;
}

const healthDetailsSchema = new Schema<IHealthDetails>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    bmi: { type: Number },
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
    dailyWaterIntake: { type: Number, required: true },
    sleepDuration: { type: Number, required: true },
    dailyStepGoal: { type: Number },
    workoutDaysPerWeek: { type: Number },
    workoutTimePerSession: { type: Number },
    goal: {
      type: String,
      enum: GOALS,
      required: true,
    },
    targetWeight: { type: Number },
    preferredTimeline: { type: String, required: true },
    focusArea: { type: String },
  },
  { timestamps: true }
);

export const HealthDetailsModel = model<IHealthDetails>(
  "HealthDetails",
  healthDetailsSchema
);