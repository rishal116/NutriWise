const NUTRITIONIST_BASE = "/api/nutritionists";

export const NUTRITIONIST_PLAN_ROUTES = {
  BASE: `${NUTRITIONIST_BASE}/plans`,

  METADATA: `${NUTRITIONIST_BASE}/plans/metadata`,

  BY_ID: (planId: string) => `${NUTRITIONIST_BASE}/plans/${planId}`,

  STATUS: (planId: string) => `${NUTRITIONIST_BASE}/plans/${planId}/status`,

  DAYS: (planId: string) => `${NUTRITIONIST_BASE}/plans/${planId}/days`,

  DAY_BY_NUMBER: (planId: string, dayNumber: number) =>
    `${NUTRITIONIST_BASE}/plans/${planId}/days/${dayNumber}`,
} as const;
