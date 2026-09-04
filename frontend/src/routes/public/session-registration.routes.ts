const SESSION_REGISTRATION_BASE = "/api/public/sessions";

export const SESSION_REGISTRATION_ROUTES = {
  REGISTER: (sessionId: string) =>
    `${SESSION_REGISTRATION_BASE}/${sessionId}/register`,

  MY_REGISTRATION: (sessionId: string) =>
    `${SESSION_REGISTRATION_BASE}/${sessionId}/registration`,

  CANCEL: (sessionId: string) =>
    `${SESSION_REGISTRATION_BASE}/${sessionId}/registration/cancel`,
} as const;
