export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type PaymentResourceType =
  | "nutritionist_plan"
  | "consultation_session"
  | "session_registration";