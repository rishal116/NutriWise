export const CHALLENGE_CATEGORIES = [
  "nutrition",
  "hydration",
  "fitness",
  "sleep",
  "mindfulness",
  "healthy_habits",
  "wellness",
  "weight_management",
] as const;

export type ChallengeCategory = (typeof CHALLENGE_CATEGORIES)[number];

export const CHALLENGE_DIFFICULTIES = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export type ChallengeDifficulty = (typeof CHALLENGE_DIFFICULTIES)[number];

export const CHALLENGE_ACCESS_TYPES = ["free", "premium"] as const;

export type ChallengeAccessType =
  (typeof CHALLENGE_ACCESS_TYPES)[number];