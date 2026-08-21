const NUTRITIONIST_BASE = "/api/nutritionists/clients";

export const NUTRITIONIST_CLIENT_ROUTES = {
  LIST: NUTRITIONIST_BASE,

  MEETING_ELIGIBLE: `${NUTRITIONIST_BASE}/meeting-eligible`,

  DETAILS: (clientId: string) => `${NUTRITIONIST_BASE}/${clientId}`,
} as const;
