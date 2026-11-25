export const SESSION_TYPES = ["educational", "interactive"] as const;

export type SessionType = (typeof SESSION_TYPES)[number];

export const SESSION_PRICING_TYPES = ["free", "paid"] as const;

export type SessionPricingType = (typeof SESSION_PRICING_TYPES)[number];

export const SESSION_STATUSES = [
  "draft",
  "scheduled",
  "live",
  "completed",
  "cancelled",
] as const;

export type SessionStatus = (typeof SESSION_STATUSES)[number];
