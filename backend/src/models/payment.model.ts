import { Schema, Types, model } from "mongoose";

import { CURRENCY, Currency } from "../constants/common/currency.constants";
import {
  PAYMENT_ITEM_TYPES,
  PAYMENT_METHODS,
  PAYMENT_PROVIDERS,
  PAYMENT_STATUSES,
  PaymentItemType,
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
} from "../constants/common/payment.constants";

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
