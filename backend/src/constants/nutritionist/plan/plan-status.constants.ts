export const PLAN_STATUSES = ["draft", "published", "archived"] as const;

export type PlanStatus = (typeof PLAN_STATUSES)[number];
