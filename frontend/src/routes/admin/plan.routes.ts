const ADMIN_BASE = "/api/admin";

export const ADMIN_PLAN_ROUTES = {
  LIST: `${ADMIN_BASE}/plans`,
  ARCHIVE: (planId: string) =>
    `${ADMIN_BASE}/plans/${planId}/archive`,
} as const;