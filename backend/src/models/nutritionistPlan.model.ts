import { Schema, model, Types } from "mongoose";

import {
  CURRENCY,
  type Currency,
} from "../constants/common/currency.constants";

import {
  SPECIALIZATIONS,
  type Specialization,
} from "../constants/nutritionist/profile/specialization.constants";

import {
  PLAN_STATUSES,
  PlanStatus,
} from "../constants/nutritionist/plan/plan-status.constants";

export interface INutritionistPlan {
  _id: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  slug: string;
  title: string;
  specialization: Specialization;
  description: string;
  durationDays: number;
  price: number;
  currency: Currency;
  features: string[];
  status: PlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

const NutritionistPlanSchema = new Schema<INutritionistPlan>(
  {
    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 120,
    },

    specialization: {
      type: String,
      enum: SPECIALIZATIONS,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    durationDays: {
      type: Number,
      required: true,
      min: 1,
      max: 365,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: [CURRENCY],
      default: CURRENCY,
    },

    features: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: PLAN_STATUSES,
      default: "draft",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

NutritionistPlanSchema.index({
  nutritionistId: 1,
  status: 1,
});

NutritionistPlanSchema.index({
  specialization: 1,
  status: 1,
});

NutritionistPlanSchema.index(
  {
    nutritionistId: 1,
    slug: 1,
  },
  {
    unique: true,
  },
);

export const NutritionistPlanModel = model<INutritionistPlan>(
  "NutritionistPlan",
  NutritionistPlanSchema,
);
