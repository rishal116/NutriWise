export const CHALLENGE_CATEGORIES = [
  "nutrition",
  "hydration",
  "fitness",
  "sleep",
  "mindfulness",
  "healthy_habits",
  "weight_management",
] as const;

export type ChallengeCategory = (typeof CHALLENGE_CATEGORIES)[number];
