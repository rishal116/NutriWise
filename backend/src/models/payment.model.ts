import { Schema, Types, model } from "mongoose";

import { CURRENCY, Currency } from "../constants/common/currency.constants";

export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "partially_refunded",
  "refunded",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_PROVIDERS = ["stripe"] as const;

export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

export const PAYMENT_ITEM_TYPES = [
  "nutritionist_plan",
  "consultation_session",
  "session_registration",
] as const;

export type PaymentItemType = (typeof PAYMENT_ITEM_TYPES)[number];

export const PAYMENT_METHODS = [
  "card",
  "upi",
  "netbanking",
  "wallet",
  "other",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface IPayment {
  _id: Types.ObjectId;
  buyerId: Types.ObjectId;
  sellerId?: Types.ObjectId | null;
  itemType: PaymentItemType;
  itemId: Types.ObjectId;
  itemSnapshot: {
    title: string;
  };
  provider: PaymentProvider;
  paymentMethod?: PaymentMethod | null;
  status: PaymentStatus;
  amount: number;
  refundedAmount: number;
  currency: Currency;
  providerReferences: {
    checkoutId?: string | null;
    transactionId?: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    itemType: {
      type: String,
      enum: PAYMENT_ITEM_TYPES,
      required: true,
    },

    itemId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    itemSnapshot: {
      title: {
        type: String,
        required: true,
        trim: true,
      },
    },

    provider: {
      type: String,
      enum: PAYMENT_PROVIDERS,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: null,
    },

    status: {
      type: String,
      enum: PAYMENT_STATUSES,
      required: true,
      default: "pending",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    refundedAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      enum: [CURRENCY],
      required: true,
      default: CURRENCY,
    },

    providerReferences: {
      checkoutId: {
        type: String,
        trim: true,
        default: null,
      },
      transactionId: {
        type: String,
        trim: true,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  },
);

PaymentSchema.index({ buyerId: 1, createdAt: -1 });
PaymentSchema.index({ sellerId: 1, createdAt: -1 });
PaymentSchema.index({ itemType: 1, itemId: 1 });
PaymentSchema.index(
  { provider: 1, "providerReferences.checkoutId": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "providerReferences.checkoutId": { $type: "string" },
    },
  },
);
PaymentSchema.index(
  { provider: 1, "providerReferences.transactionId": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "providerReferences.transactionId": { $type: "string" },
    },
  },
);

export const PaymentModel = model<IPayment>("Payment", PaymentSchema);
