import { Schema, model, Types } from "mongoose";

export type PaymentType =
  | "PLAN_PURCHASE"
  | "ADMIN_COMMISSION"
  | "NUTRITIONIST_EARNING"
  | "REFUND";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";

export interface IPayment {
  userId: Types.ObjectId;
  planId?: Types.ObjectId;
  nutritionistId?: Types.ObjectId;

  amount: number; 
  currency: string;

  type: PaymentType;
  status: PaymentStatus;

  stripeSessionId: string;
  stripePaymentIntentId?: string;

  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    planId: {
      type: Schema.Types.ObjectId,
    },

    nutritionistId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      uppercase: true,
      default: "INR",
    },

    type: {
      type: String,
      enum: [
        "PLAN_PURCHASE",
        "ADMIN_COMMISSION",
        "NUTRITIONIST_EARNING",
        "REFUND",
      ],
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },

    stripeSessionId: {
      type: String,
      required: true,
      index: true,
    },

    stripePaymentIntentId: {
      type: String,
      index: true,
    },

    metadata: {
      type: Object,
    },
  },
  { timestamps: true }
);



PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ nutritionistId: 1, createdAt: -1 });
PaymentSchema.index({ planId: 1 });

export const PaymentModel = model<IPayment>("Payment", PaymentSchema);