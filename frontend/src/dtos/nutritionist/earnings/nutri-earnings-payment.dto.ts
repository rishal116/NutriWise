export interface NutriEarningsPaymentDTO {
  paymentId: string;
  resourceType:
    | "nutritionist_plan"
    | "consultation_session"
    | "subscription"
    | "membership"
    | "wallet_topup"
    | "session"
    | "session_registration";
  resourceId: string;
  status: "pending" | "paid" | "failed" | "refunded";
  amount: number;
  currency: string;
  provider: string;
  createdAt: string;
}