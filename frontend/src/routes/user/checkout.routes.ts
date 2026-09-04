const USER_BASE = "/api/users";

export const CHECKOUT_ROUTES = {
  CREATE_SESSION: `${USER_BASE}/checkout/session`,
  CREATE_SESSION_REGISTRATION: `${USER_BASE}/checkout/session-registration`,
} as const;
