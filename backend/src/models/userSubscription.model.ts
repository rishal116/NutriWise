import { Schema, Types, model } from "mongoose";

import {
  CURRENCY,
  type Currency,
} from "../constants/common/currency.constants";

import {
  BILLING_INTERVALS,
  FEATURE_USAGE_PERIODS,
  SUBSCRIPTION_AUDIENCES,
  USER_SUBSCRIPTION_STATUSES,
  type BillingInterval,
  type FeatureUsagePeriod,
  type SubscriptionAudience,
  type UserSubscriptionStatus,
} from "../constants/common/subscription.constants";

export interface ISubscriptionFeatureSnapshot {
  key: string;
  limit: number | null;
  limitPeriod: FeatureUsagePeriod | null;
}

export interface IUserSubscription {
  _id: Types.ObjectId;

  userId: Types.ObjectId;
  subscriptionPlanId: Types.ObjectId;

  audience: SubscriptionAudience;

  billingSnapshot: {
    amount: number;
    currency: Currency;
    interval: BillingInterval;
  };

  entitlements: ISubscriptionFeatureSnapshot[];

  status: UserSubscriptionStatus;

  startedAt: Date | null;

  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;

  cancelAtPeriodEnd: boolean;
  cancelledAt: Date | null;
  endedAt: Date | null;

  isCurrent: boolean;

  providerReferences: {
    stripeSubscriptionId: string | null;
  };

  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionFeatureSnapshotSchema =
  new Schema<ISubscriptionFeatureSnapshot>(
    {
      key: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/,
      },

      limit: {
        type: Number,
        default: null,
        validate: {
          validator: (value: number | null) =>
            value === null ||
            (Number.isFinite(value) && Number.isInteger(value) && value > 0),
          message: "Feature limit must be a positive integer or null.",
        },
      },

      limitPeriod: {
        type: String,
        enum: [...FEATURE_USAGE_PERIODS, null],
        default: null,
      },
    },
    {
      _id: false,
    },
  );

const UserSubscriptionSchema = new Schema<IUserSubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subscriptionPlanId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },

    audience: {
      type: String,
      enum: SUBSCRIPTION_AUDIENCES,
      required: true,
    },

    billingSnapshot: {
      amount: {
        type: Number,
        required: true,
        min: 1,
        validate: {
          validator: (value: number) => Number.isFinite(value),
          message: "Subscription amount must be a valid number.",
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

    entitlements: {
      type: [SubscriptionFeatureSnapshotSchema],
      default: [],
      validate: [
        {
          validator: (features: ISubscriptionFeatureSnapshot[]) => {
            const keys = features.map((feature) => feature.key);

            return new Set(keys).size === keys.length;
          },
          message: "A subscription cannot contain duplicate feature keys.",
        },
        {
          validator: (features: ISubscriptionFeatureSnapshot[]) =>
            features.every((feature) => {
              const hasLimit = feature.limit !== null;
              const hasLimitPeriod = feature.limitPeriod !== null;

              return hasLimit === hasLimitPeriod;
            }),
          message: "Invalid subscription entitlement configuration.",
        },
      ],
    },

    status: {
      type: String,
      enum: USER_SUBSCRIPTION_STATUSES,
      required: true,
      default: "pending",
    },

    startedAt: {
      type: Date,
      default: null,
    },

    currentPeriodStart: {
      type: Date,
      default: null,
    },

    currentPeriodEnd: {
      type: Date,
      default: null,
    },

    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    isCurrent: {
      type: Boolean,
      default: false,
    },

    providerReferences: {
      stripeSubscriptionId: {
        type: String,
        trim: true,
        default: null,
        minlength: 1,
      },
    },
  },
  {
    timestamps: true,
  },
);

UserSubscriptionSchema.index(
  { userId: 1, createdAt: -1 },
  {
    name: "user_subscription_history",
  },
);

UserSubscriptionSchema.index(
  { userId: 1, audience: 1, status: 1 },
  {
    name: "user_subscription_audience_status",
  },
);

UserSubscriptionSchema.index(
  { userId: 1, audience: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isCurrent: true,
    },
    name: "unique_current_user_subscription_per_audience",
  },
);

UserSubscriptionSchema.index(
  { subscriptionPlanId: 1, status: 1 },
  {
    name: "subscription_plan_subscribers",
  },
);

UserSubscriptionSchema.index(
  { "providerReferences.stripeSubscriptionId": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "providerReferences.stripeSubscriptionId": {
        $type: "string",
      },
    },
    name: "unique_stripe_subscription_reference",
  },
);

UserSubscriptionSchema.index(
  { status: 1, currentPeriodEnd: 1 },
  {
    name: "subscription_period_expiry",
  },
);

export const UserSubscriptionModel = model<IUserSubscription>(
  "UserSubscription",
  UserSubscriptionSchema,
);
