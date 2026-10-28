export type UserWalletTransactionType = "credit" | "debit";

export type UserWalletTransactionReason =
  "plan_purchase" | "refund" | "withdrawal" | "top_up";

export type UserWalletTransactionStatus = "pending" | "success" | "failed";

export interface UserWalletTransactionDTO {
  id: string;
  amount: number;
  type: UserWalletTransactionType;
  reason: UserWalletTransactionReason;
  balanceBefore: number;
  balanceAfter: number;
  referenceId: string;
  status: UserWalletTransactionStatus;
  createdAt: string;
}
