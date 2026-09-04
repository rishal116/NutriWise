const NUTRITIONIST_BASE = "/api/nutritionists/sessions";

export const NUTRITIONIST_SESSION_ROUTES = {
  LIST: NUTRITIONIST_BASE,

  CREATE: NUTRITIONIST_BASE,

  DETAILS: (sessionId: string) => `${NUTRITIONIST_BASE}/${sessionId}`,

  UPDATE: (sessionId: string) => `${NUTRITIONIST_BASE}/${sessionId}`,

  DELETE: (sessionId: string) => `${NUTRITIONIST_BASE}/${sessionId}`,

  PUBLISH: (sessionId: string) => `${NUTRITIONIST_BASE}/${sessionId}/publish`,
} as const;
