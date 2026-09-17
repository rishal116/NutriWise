const CHALLENGE_BASE = "/api/public/challenges";

export const PUBLIC_CHALLENGE_ROUTES = {
  SECTIONS: `${CHALLENGE_BASE}/sections`,

  DETAILS: (challengeId: string) => `${CHALLENGE_BASE}/${challengeId}`,

  DAY_DETAILS: (challengeId: string, dayId: string) =>
    `${CHALLENGE_BASE}/${challengeId}/days/${dayId}`,

  JOIN: (challengeId: string) => `${CHALLENGE_BASE}/${challengeId}/join`,
} as const;
