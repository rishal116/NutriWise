import { Schema, Types, model } from "mongoose";

import {
  CURRENCY,
  type Currency,
} from "../constants/common/currency.constants";

export const SETTLEMENT_STATUSES = [
  "pending",
  "held",
  "released",
  "partially_reversed",
  "reversed",
] as const;

export type SettlementStatus = (typeof SETTLEMENT_STATUSES)[number];

export interface ISettlement {
  _id: Types.ObjectId;
  paymentId: Types.ObjectId;
  sellerId: Types.ObjectId;
  grossAmount: number;
  commissionAmount: number;
  sellerAmount: number;
  currency: Currency;
  status: SettlementStatus;
  createdAt: Date;
  updatedAt: Date;
}

const SettlementSchema = new Schema<ISettlement>(
  {
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
      unique: true,
    },

    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    grossAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    commissionAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    sellerAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: [CURRENCY],
      required: true,
      default: CURRENCY,
    },

    status: {
      type: String,
      enum: SETTLEMENT_STATUSES,
      required: true,
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

SettlementSchema.index({ sellerId: 1, createdAt: -1 });

export const SettlementModel = model<ISettlement>(
  "Settlement",
  SettlementSchema,
);
