import { Schema, model, Types } from "mongoose";

export const PAYMENT_STATUS = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const SUBSCRIPTION_STATUS = [
  "pending",
  "active",
  "expired",
  "cancelled",
] as const;

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[number];

export interface IUserPlan {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  nutritionistId: Types.ObjectId;

  planId: Types.ObjectId;

  paymentStatus: PaymentStatus;

  subscriptionStatus: SubscriptionStatus;

  stripeCheckoutSessionId: string;

  stripePaymentIntentId?: string;

  amount: number;

  currency: "INR" | "USD";

  planSnapshot: {
    title: string;
    durationDays: number;
    price: number;
    currency: "INR" | "USD";
  };

  startDate: Date | null;

  endDate: Date | null;

  paymentCompletedAt?: Date;

  userProgramId?: Types.ObjectId;

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

    stripeCheckoutSessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    stripePaymentIntentId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR",
    },

    planSnapshot: {
      title: {
        type: String,
        required: true,
      },

      durationDays: {
        type: Number,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      currency: {
        type: String,
        enum: ["INR", "USD"],
        required: true,
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

    paymentCompletedAt: {
      type: Date,
      default: null,
    },

    userProgramId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgram",
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

export const UserPlanModel = model<IUserPlan>(
  "UserPlan",
  UserPlanSchema,
);