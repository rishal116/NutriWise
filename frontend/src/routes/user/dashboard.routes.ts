const USER_BASE = "/api/users";
const DASHBOARD_BASE = `${USER_BASE}/dashboard`;
export const DASHBOARD_ROUTES = {
  OVERVIEW: `${DASHBOARD_BASE}/overview`,
} as const;
