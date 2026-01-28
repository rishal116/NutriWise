import { Schema, model, Types } from "mongoose";

export type PaymentStatus = "SUCCESS" | "REFUNDED";

export interface IPaymentHistory {
  userId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  planId: Types.ObjectId;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  totalAmount: number;
  adminAmount: number;
  nutritionistAmount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: Date;
}

const paymentHistorySchema = new Schema<IPaymentHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "Nutritionist",
      required: true,
      index: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "NutritionistPlan",
      required: true,
    },
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
      index: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    adminAmount: {
      type: Number,
      required: true,
    },
    nutritionistAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["SUCCESS", "REFUNDED"],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const PaymentHistoryModel = model<IPaymentHistory>(
  "PaymentHistory",
  paymentHistorySchema
);
