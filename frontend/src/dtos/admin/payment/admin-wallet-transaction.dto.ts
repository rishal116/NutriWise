export type WalletTransactionType = "credit" | "debit";

export type WalletTransactionReason =
  | "plan_purchase"
  | "refund"
  | "withdrawal"
  | "top_up";

export type WalletTransactionStatus =
  | "pending"
  | "success"
  | "failed";

export interface AdminWalletTransactionDTO {
  _id: string;
  walletId: string;
  amount: number;
  type: WalletTransactionType;
  reason: WalletTransactionReason;
  balanceBefore: number;
  balanceAfter: number;
  referenceId: string;
  status: WalletTransactionStatus;
  createdAt: string;
}

export interface AdminWalletTransactionQueryDTO {
  walletId: string;
  type?: WalletTransactionType;
  reason?: WalletTransactionReason;
  status?: WalletTransactionStatus;
  cursor?: string;
  limit?: number;
}