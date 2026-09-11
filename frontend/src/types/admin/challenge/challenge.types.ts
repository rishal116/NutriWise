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

export type ChallengeAccessType = (typeof CHALLENGE_ACCESS_TYPES)[number];

export const CHALLENGE_STATUSES = ["draft", "published", "archived"] as const;

export type ChallengeStatus = (typeof CHALLENGE_STATUSES)[number];

export const CHALLENGE_SORT_OPTIONS = ["newest", "oldest"] as const;

export type ChallengeSortBy = (typeof CHALLENGE_SORT_OPTIONS)[number];
