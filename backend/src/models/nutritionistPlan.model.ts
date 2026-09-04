import { Schema, model, Types } from "mongoose";

import { SPECIALIZATIONS, Specialization } from "../types/nutritionist.types";

import { CURRENCIES, Currency } from "../constants/currency.constants";

export const PLAN_STATUS = ["draft", "published", "archived"] as const;

export type PlanStatus = (typeof PLAN_STATUS)[number];

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

  isDeleted: boolean;

  deletedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const NutritionistPlanSchema = new Schema<INutritionistPlan>(
  {
    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
      index: true,
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
      enum: CURRENCIES,
      default: "inr",
    },

    features: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: PLAN_STATUS,
      default: "draft",
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

NutritionistPlanSchema.index({
  nutritionistId: 1,
  status: 1,
  isDeleted: 1,
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
