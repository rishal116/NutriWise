const NUTRITIONIST_BASE = "/api/nutritionists";

export const NUTRITIONIST_APPLICATION_ROUTES = {
  SUBMIT: `${NUTRITIONIST_BASE}/application/submit`,
  DETAILS: `${NUTRITIONIST_BASE}/application/details`,
  STATUS: `${NUTRITIONIST_BASE}/application/status`,
} as const;