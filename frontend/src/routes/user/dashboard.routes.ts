const USER_BASE = "/api/users";
const DASHBOARD_BASE = `${USER_BASE}/dashboard`;

export const DASHBOARD_ROUTES = {
  OVERVIEW: `${DASHBOARD_BASE}/overview`,
  ACTIVE_PROGRAMS: `${DASHBOARD_BASE}/active-programs`,
  TODAY_TRACKING: `${DASHBOARD_BASE}/today-tracking`,
  WEEKLY_PROGRESS: `${DASHBOARD_BASE}/weekly-progress`,
  UPCOMING_CONSULTATIONS: `${DASHBOARD_BASE}/upcoming-consultations`,
  PAYMENT_OVERVIEW: `${DASHBOARD_BASE}/payment-overview`,
} as const;
