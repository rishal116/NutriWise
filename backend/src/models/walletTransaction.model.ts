import { Schema, model, Types } from "mongoose";

export type WalletTransactionType = "CREDIT" | "DEBIT";

export type WalletTransactionReason =
  | "PLAN_PURCHASE"
  | "REFUND"
  | "WITHDRAWAL"
  | "TOP_UP";

export type WalletTxnStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED";

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

const walletTransactionSchema = new Schema<IWalletTransaction>(
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
      enum: ["CREDIT", "DEBIT"],
      required: true,
      index: true,
    },

    reason: {
      type: String,
      enum: ["PLAN_PURCHASE", "REFUND", "WITHDRAWAL", "TOP_UP"],
      required: true,
      index: true,
    },

    balanceBefore: {
      type: Number,
      required: true,
    },

    balanceAfter: {
      type: Number,
      required: true,
    },

    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "SUCCESS",
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

walletTransactionSchema.index({ walletId: 1, createdAt: -1 });

export const WalletTransactionModel = model<IWalletTransaction>(
  "WalletTransaction",
  walletTransactionSchema
);