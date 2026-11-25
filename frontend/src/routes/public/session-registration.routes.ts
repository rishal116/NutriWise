const SESSION_REGISTRATION_BASE = "/api/public/sessions";

export const SESSION_REGISTRATION_ROUTES = {
  REGISTER: (sessionId: string) =>
    `${SESSION_REGISTRATION_BASE}/${sessionId}/register`,

  CANCEL: (sessionId: string) =>
    `${SESSION_REGISTRATION_BASE}/${sessionId}/registration/cancel`,
} as const;
