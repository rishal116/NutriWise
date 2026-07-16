export const PLAN_SORT = [
  "newest",
  "price_low_to_high",
  "price_high_to_low",
  "duration_shortest",
  "duration_longest",
] as const;

export type PlanSort = (typeof PLAN_SORT)[number];
