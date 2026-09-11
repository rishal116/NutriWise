const ADMIN_BASE = "/api/admin";

export const ADMIN_CHALLENGE_ROUTES = {
  CHALLENGES: `${ADMIN_BASE}/challenges`,

  CHALLENGE_DETAILS: (challengeId: string) =>
    `${ADMIN_BASE}/challenges/${challengeId}`,

  PUBLISH_CHALLENGE: (challengeId: string) =>
    `${ADMIN_BASE}/challenges/${challengeId}/publish`,
} as const;
