import { Schema, model, Types } from "mongoose";

import {
  ACTIVITY_LEVELS,
  DIET_TYPES,
  GOALS,
  TIMELINES,
  type ActivityLevel,
  type DietType,
  type GoalType,
  type TimelineType,
} from "../types/health.types";

export interface IHealthDetails {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  dietType: DietType;
  goal: GoalType;
  targetWeightKg?: number;
  preferredTimeline?: TimelineType;
  createdAt: Date;
  updatedAt: Date;
}

const healthDetailsSchema = new Schema<IHealthDetails>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    heightCm: {
      type: Number,
      required: true,
      min: 1,
      max: 300,
    },
    weightKg: {
      type: Number,
      required: true,
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
    goal: {
      type: String,
      enum: GOALS,
      required: true,
    },
    targetWeightKg: {
      type: Number,
      min: 1,
      max: 700,
    },
    preferredTimeline: {
      type: String,
      enum: TIMELINES,
    },
  },
  {
    timestamps: true,
  },
);

healthDetailsSchema.index({ userId: 1 }, { unique: true });

export const HealthDetailsModel = model<IHealthDetails>(
  "HealthDetails",
  healthDetailsSchema,
);
