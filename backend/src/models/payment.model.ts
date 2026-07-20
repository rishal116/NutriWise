import { Schema, model, Types } from "mongoose";

export const PAYMENT_STATUS = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

export const PAYMENT_PROVIDER = ["stripe", "razorpay"] as const;

export const PAYMENT_RESOURCE_TYPES = [
  "nutritionist_plan",
  "consultation_session",
  "subscription",
  "membership",
  "wallet_topup",
] as const;

export const PAYMENT_CURRENCIES = ["INR", "USD"] as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export type PaymentProvider = (typeof PAYMENT_PROVIDER)[number];

export type PaymentResourceType = (typeof PAYMENT_RESOURCE_TYPES)[number];

export type PaymentCurrency = (typeof PAYMENT_CURRENCIES)[number];

export interface IPayment {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  sellerId?: Types.ObjectId;

  resourceType: PaymentResourceType;

  resourceId: Types.ObjectId;

  provider: PaymentProvider;

  status: PaymentStatus;

  amount: number;

  currency: PaymentCurrency;

  checkoutSessionId: string;

  paymentIntentId?: string;

  chargeId?: string;

  itemSnapshot: {
    title: string;

    price: number;

    currency: PaymentCurrency;
  };

  refundedAmount?: number;

  refundReason?: string;

  metadata?: Record<string, string>;

  createdAt: Date;

  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    resourceType: {
      type: String,
      enum: PAYMENT_RESOURCE_TYPES,
      required: true,
      index: true,
    },

    resourceId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    provider: {
      type: String,
      enum: PAYMENT_PROVIDER,
      required: true,
      default: "stripe",
    },

    status: {
      type: String,
      enum: PAYMENT_STATUS,
      required: true,
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
      enum: PAYMENT_CURRENCIES,
      required: true,
      default: "INR",
    },

    checkoutSessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    paymentIntentId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
      index: true,
    },

    chargeId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
      index: true,
    },

    itemSnapshot: {
      title: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      currency: {
        type: String,
        enum: PAYMENT_CURRENCIES,
        required: true,
      },
    },

    refundedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    refundReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

PaymentSchema.index({
  userId: 1,
  createdAt: -1,
});

PaymentSchema.index({
  sellerId: 1,
  createdAt: -1,
});

PaymentSchema.index({
  resourceType: 1,
  resourceId: 1,
});

PaymentSchema.index({
  provider: 1,
  checkoutSessionId: 1,
});

export const PaymentModel = model<IPayment>("Payment", PaymentSchema);
