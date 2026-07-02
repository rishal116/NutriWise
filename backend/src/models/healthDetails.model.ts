import { Schema, model, Document, Types } from "mongoose";
import {
  ActivityLevel,
  DietType,
  GoalType,
  ACTIVITY_LEVELS,
  DIET_TYPES,
  GOALS,
  TIMELINES,
  TimelineType,
} from "../types/health.types";

export interface IHealthDetails extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  heightCm: number;
  weightKg: number;

  activityLevel: ActivityLevel;
  dietType: DietType;

  goal: GoalType;
  targetWeightKg?: number;
  preferredTimeline: TimelineType;

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

    heightCm: { type: Number, required: true },
    weightKg: { type: Number, required: true },

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

    targetWeightKg: { type: Number },

    preferredTimeline: {
      type: String,
      enum: TIMELINES,
      required: true,
    },
  },
  { timestamps: true },
);

export const HealthDetailsModel = model<IHealthDetails>(
  "HealthDetails",
  healthDetailsSchema,
);
