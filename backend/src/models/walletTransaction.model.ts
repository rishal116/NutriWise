import { Schema, model, Types } from "mongoose";

export const WALLET_TRANSACTION_TYPES = ["credit", "debit"] as const;

export type WalletTransactionType = (typeof WALLET_TRANSACTION_TYPES)[number];

export const WALLET_TRANSACTION_REASONS = [
  "plan_purchase",
  "refund",
  "withdrawal",
  "top_up",
] as const;

export type WalletTransactionReason =
  (typeof WALLET_TRANSACTION_REASONS)[number];

export const WALLET_TXN_STATUSES = ["pending", "success", "failed"] as const;

export type WalletTxnStatus = (typeof WALLET_TXN_STATUSES)[number];

export interface IWalletTransaction {
  walletId: Types.ObjectId;
  amount: number;
  type: WalletTransactionType;
  reason: WalletTransactionReason;
  balanceBefore: number;
  balanceAfter: number;
  referenceId: string;
  status: WalletTxnStatus;
  createdAt: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    type: {
      type: String,
      enum: WALLET_TRANSACTION_TYPES,
      required: true,
      index: true,
    },

    reason: {
      type: String,
      enum: WALLET_TRANSACTION_REASONS,
      required: true,
      index: true,
    },

    balanceBefore: {
      type: Number,
      required: true,
      min: 0,
    },

    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },

    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: WALLET_TXN_STATUSES,
      default: "success",
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

WalletTransactionSchema.index({
  walletId: 1,
  createdAt: -1,
});

export const WalletTransactionModel = model<IWalletTransaction>(
  "WalletTransaction",
  WalletTransactionSchema,
);
