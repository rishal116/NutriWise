const ADMIN_BASE = "/api/admin";

export const ADMIN_SUBSCRIPTION_PLAN_ROUTES = {
  SUBSCRIPTION_PLANS: `${ADMIN_BASE}/subscription-plans`,

  SUBSCRIPTION_PLAN_DETAILS: (planId: string) =>
    `${ADMIN_BASE}/subscription-plans/${planId}`,

  PUBLISH_SUBSCRIPTION_PLAN: (planId: string) =>
    `${ADMIN_BASE}/subscription-plans/${planId}/publish`,

  ARCHIVE_SUBSCRIPTION_PLAN: (planId: string) =>
    `${ADMIN_BASE}/subscription-plans/${planId}/archive`,
} as const;
