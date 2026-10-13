export interface GetNutriEarningsQueryDTO {
  limit?: number;
  cursor?: string;
  transactionType?: "credit" | "debit";
  reason?: "plan_purchase" | "refund" | "withdrawal" | "top_up";
  transactionStatus?: "pending" | "success" | "failed";
  resourceType?:
    | "nutritionist_plan"
    | "consultation_session"
    | "subscription"
    | "membership"
    | "wallet_topup"
    | "session"
    | "session_registration";
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
}
