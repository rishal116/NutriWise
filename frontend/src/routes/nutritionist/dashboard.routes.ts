const NUTRITIONIST_BASE = "/api/nutritionists/dashboard";

export const NUTRITIONIST_DASHBOARD_ROUTES = {
  OVERVIEW: NUTRITIONIST_BASE,
  EARNINGS_CHART: `${NUTRITIONIST_BASE}/earnings-chart`,
  RECENT_ACTIVITIES: `${NUTRITIONIST_BASE}/recent-activities`,
} as const;