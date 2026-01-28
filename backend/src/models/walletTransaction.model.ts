import { Schema, model, Types } from "mongoose";

export type WalletTransactionType = "CREDIT" | "DEBIT";
export type WalletTransactionReason =
  | "PLAN_PURCHASE"
  | "REFUND"
  | "WITHDRAWAL"
  | "TOP_UP";

export interface IWalletTransaction {
  walletId: Types.ObjectId;
  amount: number;
  type: WalletTransactionType;
  reason: WalletTransactionReason;
  referenceId: string;           
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
    },
    reason: {
      type: String,
      enum: ["PLAN_PURCHASE", "REFUND", "WITHDRAWAL", "TOP_UP"],
      required: true,
    },
    referenceId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const WalletTransactionModel = model<IWalletTransaction>(
  "WalletTransaction",
  walletTransactionSchema
);
