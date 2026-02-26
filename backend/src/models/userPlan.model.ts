import { Schema, model, Types } from "mongoose";

export const PAYMENT_STATUS = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

export type PaymentStatus = typeof PAYMENT_STATUS[number];

export const SUBSCRIPTION_STATUS = [
  "ACTIVE",
  "CANCELLED",
  "EXPIRED",
  "PENDING",
] as const;

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[number];



export interface IUserPlan {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  paymentProvider: "stripe" | "razorpay";
  paymentId: string;
  checkoutSessionId?: string;
  paymentStatus: PaymentStatus;
  amount: number;
  currency: string;
  planSnapshot: {
    name: string;
    durationDays: number;
  };
  status: SubscriptionStatus;
  userProgramId?: Types.ObjectId;
  startDate: Date;
  endDate: Date;
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

    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
      index: true,
    },

    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    paymentProvider: {
      type: String,
      enum: ["stripe", "razorpay"],
      required: true,
      index: true,
    },

    paymentId: {
      type: String,
      required: true,
      index: true,
    },

    checkoutSessionId: {
      type: String,
      sparse: true,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS,
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
      default: "INR",
    },

    planSnapshot: {
      name: { type: String, required: true },
      durationDays: { type: Number, required: true },
    },

    status: {
      type: String,
      enum: SUBSCRIPTION_STATUS,
      default: "PENDING",
      index: true,
    },

    userProgramId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgram",
      index: true,
    },

    startDate: {
      type: Date,
      required: true,
      index: true,
    },

    endDate: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

UserPlanSchema.index(
  { userId: 1, planId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "ACTIVE" } }
);

UserPlanSchema.index({ status: 1, endDate: 1 });

export const UserPlanModel = model<IUserPlan>("UserPlan", UserPlanSchema);