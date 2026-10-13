import { Types } from "mongoose";
import { IWalletTransaction } from "../../../models/walletTransaction.model";

export type INutriEarningsTransactionProjection = Pick<
  IWalletTransaction,
  | "amount"
  | "type"
  | "reason"
  | "balanceBefore"
  | "balanceAfter"
  | "referenceId"
  | "status"
  | "createdAt"
> & {
  transactionId: Types.ObjectId;
};

export interface INutriEarningsTransactionProjectionWithCursor extends INutriEarningsTransactionProjection {
  cursorId: Types.ObjectId;
  cursorValue: Date;
}
