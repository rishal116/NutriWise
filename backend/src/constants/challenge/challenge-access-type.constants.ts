export const CHALLENGE_ACCESS_TYPES = ["free", "premium"] as const;

export type ChallengeAccessType = (typeof CHALLENGE_ACCESS_TYPES)[number];
