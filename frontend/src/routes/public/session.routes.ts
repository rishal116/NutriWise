const SESSION_BASE = "/api/public/sessions";

export const PUBLIC_SESSION_ROUTES = {
  LIST: SESSION_BASE,
  DETAILS: (sessionId: string) => `${SESSION_BASE}/${sessionId}`,
} as const;