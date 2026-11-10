export const CHALLENGE_ACTIVITY_TYPES = [
  "exercise",
  "nutrition",
  "hydration",
  "meditation",
  "breathing",
  "sleep",
  "healthy_habit",
  "education",
  "stretching",
  "recovery",
  "measurement",
] as const;

export type ChallengeActivityType = (typeof CHALLENGE_ACTIVITY_TYPES)[number];

export const CHALLENGE_ACTIVITY_VALUE_TYPES = [
  "boolean",
  "number",
  "duration",
] as const;

export type ChallengeActivityValueType =
  (typeof CHALLENGE_ACTIVITY_VALUE_TYPES)[number];
