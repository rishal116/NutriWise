const NUTRITIONIST_BASE = "/api/nutritionists";

export const NUTRITIONIST_PLAN_ROUTES = {
  BASE: `${NUTRITIONIST_BASE}/plans`,

  METADATA: `${NUTRITIONIST_BASE}/plans/metadata`,

  BY_ID: (planId: string) =>
    `${NUTRITIONIST_BASE}/plans/${planId}`,
} as const;