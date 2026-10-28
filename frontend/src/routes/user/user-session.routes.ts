
const USER_BASE = "/api/users";
const USER_SESSIONS_BASE = `${USER_BASE}/sessions`;

export const USER_SESSION_ROUTES = {
  LIST: USER_SESSIONS_BASE,
  DETAILS: (sessionId: string) => `${USER_SESSIONS_BASE}/${sessionId}`,
} as const;
