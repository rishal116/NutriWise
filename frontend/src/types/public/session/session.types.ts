export const SESSION_TYPES = [
  "webinar",
  "workshop",
  "group_consultation",
  "qna",
  "seminar",
] as const;

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

export const SESSION_CURRENCIES = ["inr"] as const;

export type SessionCurrency = (typeof SESSION_CURRENCIES)[number];
