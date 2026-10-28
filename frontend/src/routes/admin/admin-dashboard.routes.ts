const ADMIN_BASE = "/api/admin";

export const ADMIN_DASHBOARD_ROUTES = {
  OVERVIEW: `${ADMIN_BASE}/dashboard/overview`,
  REGISTRATION_TREND: `${ADMIN_BASE}/dashboard/registration-trend`,
  REVENUE_TREND: `${ADMIN_BASE}/dashboard/revenue-trend`,
  RECENT_USERS: `${ADMIN_BASE}/dashboard/recent-users`,
  PENDING_NUTRITIONISTS: `${ADMIN_BASE}/dashboard/pending-nutritionists`,
  RECENT_PAYMENTS: `${ADMIN_BASE}/dashboard/recent-payments`,
} as const;