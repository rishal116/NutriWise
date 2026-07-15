const USER_BASE = "/api/users";

export const PROFILE_ROUTES = {
  PROFILE: `${USER_BASE}/profile`,
  PROFILE_IMAGE: `${USER_BASE}/profile/image`,
} as const;