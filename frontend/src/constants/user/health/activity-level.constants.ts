export const ACTIVITY_LEVELS = [
  "sedentary",
  "lightly_active",
  "moderately_active",
  "active",
  "very_active",
] as const;

export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];
