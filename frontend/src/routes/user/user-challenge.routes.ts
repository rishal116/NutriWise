const USER_BASE = "/api/users";

export const USER_CHALLENGE_ROUTES = {
  BROWSE: `${USER_BASE}/challenges`,

  JOIN: (challengeId: string) => `${USER_BASE}/challenges/${challengeId}/join`,

  GET: (userChallengeId: string) =>
    `${USER_BASE}/challenges/${userChallengeId}`,
} as const;
