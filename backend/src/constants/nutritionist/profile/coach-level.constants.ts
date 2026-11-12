export const COACH_LEVELS = [
  "beginner",
  "verified",
  "expert",
  "top_coach",
] as const;

export type CoachLevel = (typeof COACH_LEVELS)[number];
