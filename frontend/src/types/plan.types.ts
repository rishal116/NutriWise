export const PLAN_STATUS = [
  "draft",
  "published",
  "archived",
] as const;

export const PLAN_CURRENCY = [
  "INR",
  "USD",
] as const;

export const PLAN_SORT = [
  "newest",
  "price_low_to_high",
  "price_high_to_low",
  "duration_shortest",
  "duration_longest",
] as const;

export type PlanStatus =
  (typeof PLAN_STATUS)[number];

export type PlanCurrency =
  (typeof PLAN_CURRENCY)[number];

export type PlanSort =
  (typeof PLAN_SORT)[number];