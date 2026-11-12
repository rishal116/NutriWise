import { Schema, model, Types } from "mongoose";

import {
  CURRENCY,
  type Currency,
} from "../constants/common/currency.constants";
import {
  SPECIALIZATIONS,
  type Specialization,
} from "../constants/nutritionist/profile/specialization.constants";

export interface IUserPlan {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  planId: Types.ObjectId;
  amount: number;
  currency: Currency;
  planSnapshot: {
    title: string;
    description?: string;
    specialization: Specialization;
    durationDays: number;
    price: number;
    currency: Currency;
    features: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserPlanSchema = new Schema<IUserPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    planId: {
      type: Schema.Types.ObjectId,
      ref: "NutritionistPlan",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: [CURRENCY],
      required: true,
      default: CURRENCY,
    },

    planSnapshot: {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },

      specialization: {
        type: String,
        enum: SPECIALIZATIONS,
        required: true,
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
        required: true,
        default: CURRENCY,
      },

      features: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  },
);

UserPlanSchema.index({ userId: 1, createdAt: -1 });
UserPlanSchema.index({ nutritionistId: 1, createdAt: -1 });
UserPlanSchema.index({ userId: 1, planId: 1 });

export const UserPlanModel = model<IUserPlan>("UserPlan", UserPlanSchema);
