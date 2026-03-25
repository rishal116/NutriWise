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
      title: string;
      durationInDays:number;
      price: number;
      currency: string;
  };
  status: SubscriptionStatus;
  userProgramId?: Types.ObjectId;
  startDate: Date;
  isDeleted: boolean;
  pendingPayout: number;
  adminCommission: number;
  isPayoutDone: boolean;
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
    },

    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      unique: true,
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
      enum: ["INR", "USD"],
      default: "INR",
    },
    
    planSnapshot: {
      title: { type: String, required: true },
      durationInDays: { type: Number, required: true },
      price: { type: Number, required: true },
      currency: { type: String, required: true },
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
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    pendingPayout:{
      type:Number,
    },
    adminCommission:{
      type:Number
    },
    isPayoutDone:{
      type:Boolean,
      default:false
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

UserPlanSchema.index(
  { userId: 1, nutritionistId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "ACTIVE" },
  }
)

UserPlanSchema.index({ userId: 1, status: 1, isDeleted: 1 });

UserPlanSchema.index({ status: 1, endDate: 1 });

export const UserPlanModel = model<IUserPlan>("UserPlan", UserPlanSchema);