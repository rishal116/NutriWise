import { Schema, model, Types } from "mongoose";

export const PAYMENT_STATUS = [
  "pending",
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const SUBSCRIPTION_STATUS = [
  "pending",
  "active",
  "expired",
  "cancelled",
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[number];

export const PAYMENT_PROVIDERS = ["stripe", "razorpay", "paypal"] as const;
export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

export const CURRENCIES = ["INR", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export interface IUserPlan {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  planId: Types.ObjectId;
  paymentStatus: PaymentStatus;
  subscriptionStatus: SubscriptionStatus;
  amount: number;
  currency: Currency;
  payment: {
    provider: PaymentProvider;
    sessionId: string;
    transactionId?: string;
    completedAt?: Date;
  };
  planSnapshot: {
    title: string;
    description?: string;
    specialization: string;
    durationDays: number;
    price: number;
    currency: Currency;
    thumbnail?: string;
  };
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserPlanSchema = new Schema<IUserPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    planId: {
      type: Schema.Types.ObjectId,
      ref: "NutritionistPlan",
      required: true,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS,
      default: "pending",
      index: true,
    },

    subscriptionStatus: {
      type: String,
      enum: SUBSCRIPTION_STATUS,
      default: "pending",
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: CURRENCIES,
      required: true,
    },

    payment: {
      provider: {
        type: String,
        enum: PAYMENT_PROVIDERS,
        required: true,
      },

      sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      transactionId: {
        type: String,
        unique: true,
        sparse: true,
        index: true,
      },

      completedAt: {
        type: Date,
        default: null,
      },
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
        required: true,
        trim: true,
      },

      durationDays: {
        type: Number,
        required: true,
        min: 1,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      currency: {
        type: String,
        enum: CURRENCIES,
        required: true,
      },

      thumbnail: {
        type: String,
        trim: true,
      },
    },

    startDate: {
      type: Date,
      default: null,
      index: true,
    },

    endDate: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

UserPlanSchema.index({
  userId: 1,
  subscriptionStatus: 1,
});
UserPlanSchema.index({
  nutritionistId: 1,
  subscriptionStatus: 1,
});
UserPlanSchema.index({
  endDate: 1,
  subscriptionStatus: 1,
});
UserPlanSchema.index({
  userId: 1,
  createdAt: -1,
});
UserPlanSchema.index({
  userId: 1,
  planId: 1,
  subscriptionStatus: 1,
});

export const UserPlanModel = model<IUserPlan>("UserPlan", UserPlanSchema);
