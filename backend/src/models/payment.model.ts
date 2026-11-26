import { Schema, Types, model } from "mongoose";

import {
  CURRENCY,
  type Currency,
} from "../constants/common/currency.constants";

import {
  PAYMENT_ITEM_TYPES,
  PAYMENT_METHODS,
  PAYMENT_PROVIDERS,
  PAYMENT_STATUSES,
  type PaymentItemType,
  type PaymentMethod,
  type PaymentProvider,
  type PaymentStatus,
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
    invoiceId?: string | null;
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
      min: 1,
      validate: {
        validator: (value: number) => Number.isFinite(value),
        message: "Payment amount must be a valid number.",
      },
    },

    refundedAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      validate: {
        validator: (value: number) => Number.isFinite(value),
        message: "Refunded amount must be a valid number.",
      },
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
        minlength: 1,
      },

      transactionId: {
        type: String,
        trim: true,
        default: null,
        minlength: 1,
      },

      invoiceId: {
        type: String,
        trim: true,
        default: null,
        minlength: 1,
      },
    },
  },
  {
    timestamps: true,
  },
);

PaymentSchema.pre("validate", function () {
  if (this.refundedAmount > this.amount) {
    this.invalidate(
      "refundedAmount",
      "Refunded amount cannot exceed the original payment amount.",
    );
  }

  if (
    this.status === "partially_refunded" &&
    !(this.refundedAmount > 0 && this.refundedAmount < this.amount)
  ) {
    this.invalidate(
      "status",
      "Partially refunded payments must have a refund amount greater than zero and less than the original amount.",
    );
  }

  if (this.status === "refunded" && this.refundedAmount !== this.amount) {
    this.invalidate(
      "status",
      "Fully refunded payments must have a refund amount equal to the original payment amount.",
    );
  }

  if (
    this.refundedAmount > 0 &&
    this.status !== "partially_refunded" &&
    this.status !== "refunded"
  ) {
    this.invalidate(
      "status",
      "Payments with a refund amount must have a refunded status.",
    );
  }
});

PaymentSchema.index(
  { buyerId: 1, createdAt: -1 },
  {
    name: "payment_buyer_history",
  },
);

PaymentSchema.index(
  { sellerId: 1, createdAt: -1 },
  {
    name: "payment_seller_history",
  },
);

PaymentSchema.index(
  { itemType: 1, itemId: 1 },
  {
    name: "payment_item_lookup",
  },
);

PaymentSchema.index(
  { provider: 1, "providerReferences.checkoutId": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "providerReferences.checkoutId": {
        $type: "string",
      },
    },
    name: "unique_payment_checkout_reference",
  },
);

PaymentSchema.index(
  { provider: 1, "providerReferences.transactionId": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "providerReferences.transactionId": {
        $type: "string",
      },
    },
    name: "unique_payment_transaction_reference",
  },
);

PaymentSchema.index(
  { provider: 1, "providerReferences.invoiceId": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "providerReferences.invoiceId": {
        $type: "string",
      },
    },
    name: "unique_payment_invoice_reference",
  },
);

export const PaymentModel = model<IPayment>("Payment", PaymentSchema);
