import { Schema, Types, model } from "mongoose";

import {
  CURRENCY,
  type Currency,
} from "../constants/common/currency.constants";

import {
  BILLING_INTERVALS,
  SUBSCRIPTION_AUDIENCES,
  SUBSCRIPTION_PLAN_STATUSES,
  type BillingInterval,
  type SubscriptionAudience,
  type SubscriptionPlanStatus,
} from "../constants/common/subscription.constants";

export interface IPlanFeature {
  key: string;
  enabled: boolean;
}

export interface ISubscriptionPlan {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  audience: SubscriptionAudience;
  billing: {
    amount: number;
    currency: Currency;
    interval: BillingInterval;
  };
  features: IPlanFeature[];
  providerReferences: {
    stripePriceId: string | null;
  };
  status: SubscriptionPlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PlanFeatureSchema = new Schema<IPlanFeature>(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/,
      maxlength: 100,
    },

    enabled: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    _id: false,
  },
);

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    audience: {
      type: String,
      enum: SUBSCRIPTION_AUDIENCES,
      required: true,
    },

    billing: {
      amount: {
        type: Number,
        required: true,
        min: 50,
        validate: {
          validator: (value: number) =>
            Number.isFinite(value) && Number.isInteger(value),
          message:
            "Subscription amount must be a valid whole number in rupees.",
        },
      },

      currency: {
        type: String,
        enum: [CURRENCY],
        required: true,
        default: CURRENCY,
      },

      interval: {
        type: String,
        enum: BILLING_INTERVALS,
        required: true,
      },
    },

    features: {
      type: [PlanFeatureSchema],
      default: [],
      validate: {
        validator: (features: IPlanFeature[]) => {
          const keys = features.map((feature) => feature.key);

          return new Set(keys).size === keys.length;
        },
        message: "A plan cannot contain duplicate feature keys.",
      },
    },

    providerReferences: {
      stripePriceId: {
        type: String,
        trim: true,
        default: null,
        minlength: 1,
      },
    },

    status: {
      type: String,
      enum: SUBSCRIPTION_PLAN_STATUSES,
      required: true,
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

SubscriptionPlanSchema.index(
  { audience: 1, slug: 1 },
  {
    unique: true,
    name: "unique_subscription_plan_slug_per_audience",
  },
);

SubscriptionPlanSchema.index(
  { audience: 1, status: 1, createdAt: -1 },
  {
    name: "subscription_plan_audience_status_created",
  },
);

SubscriptionPlanSchema.index(
  { "providerReferences.stripePriceId": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "providerReferences.stripePriceId": {
        $type: "string",
      },
    },
    name: "unique_subscription_plan_stripe_price",
  },
);

export const SubscriptionPlanModel = model<ISubscriptionPlan>(
  "SubscriptionPlan",
  SubscriptionPlanSchema,
);
