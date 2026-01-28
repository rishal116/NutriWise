import { Schema, model, Types } from "mongoose";

export type PaymentType =
  | "PLAN_PURCHASE"
  | "ADMIN_COMMISSION"
  | "NUTRITIONIST_EARNING"
  | "REFUND";

export type PaymentStatus = "SUCCESS" | "FAILED" | "REFUNDED";

export interface IPayment {
  userId: Types.ObjectId;
  planId?: Types.ObjectId;
  nutritionistId?: Types.ObjectId;

  amount: number;
  currency: string;

  type: PaymentType;
  status: PaymentStatus;

  stripeSessionId: string;

  metadata?: Record<string, any>;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    planId: { type: Schema.Types.ObjectId },
    nutritionistId: { type: Schema.Types.ObjectId },

    amount: { type: Number, required: true },
    currency: { type: String, required: true },

    type: {
      type: String,
      enum: [
        "PLAN_PURCHASE",
        "ADMIN_COMMISSION",
        "NUTRITIONIST_EARNING",
        "REFUND",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "REFUNDED"],
      default: "SUCCESS",
    },

    stripeSessionId: { type: String, required: true },
    metadata: { type: Object },
  },
  { timestamps: true }
);

export const PaymentModel = model<IPayment>("Payment", PaymentSchema);
