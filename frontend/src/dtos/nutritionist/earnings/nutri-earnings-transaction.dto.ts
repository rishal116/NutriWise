export interface NutriEarningsTransactionDTO {
  transactionId: string;
  amount: number;
  type: "credit" | "debit";
  reason: "plan_purchase" | "refund" | "withdrawal" | "top_up";
  balanceBefore: number;
  balanceAfter: number;
  referenceId: string | null;
  status: "pending" | "success" | "failed";
  createdAt: string;
}
