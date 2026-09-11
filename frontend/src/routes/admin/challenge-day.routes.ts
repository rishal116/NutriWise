const ADMIN_BASE = "/api/admin";

export const ADMIN_CHALLENGE_DAY_ROUTES = {
  DAYS: (challengeId: string) => `${ADMIN_BASE}/challenges/${challengeId}/days`,

  DAY_DETAILS: (challengeId: string, dayId: string) =>
    `${ADMIN_BASE}/challenges/${challengeId}/days/${dayId}`,
} as const;
