export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "partially_refunded",
  "refunded",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_PROVIDERS = ["stripe"] as const;

export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

export const PAYMENT_ITEM_TYPES = [
  "nutritionist_plan",
  "consultation_session",
  "session_registration",
] as const;

export type PaymentItemType = (typeof PAYMENT_ITEM_TYPES)[number];

export const PAYMENT_METHODS = [
  "card",
  "upi",
  "netbanking",
  "wallet",
  "other",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const COMMISSION_RATE = 10;
