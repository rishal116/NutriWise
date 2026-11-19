export const CHALLENGE_STATUSES = ["draft", "published", "archived"] as const;

export type ChallengeStatus = (typeof CHALLENGE_STATUSES)[number];
