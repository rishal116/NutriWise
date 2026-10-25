export const ACTIVITY_LEVELS = [
  "sedentary",
  "lightly_active",
  "moderately_active",
  "active",
  "very_active",
] as const;

export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];

export const DIET_TYPES = ["veg", "non_veg", "vegan", "eggetarian"] as const;

export type DietType = (typeof DIET_TYPES)[number];

export const GOALS = [
  "fitness_weight_loss",
  "fitness_weight_gain",
  "muscle_build",
  "medical_diabetes",
  "medical_pcos",
  "lifestyle_general",
  "mental_wellness",
] as const;

export type GoalType = (typeof GOALS)[number];

export const TIMELINES = [
  "4_weeks",
  "8_weeks",
  "12_weeks",
  "16_weeks",
  "20_weeks",
  "24_weeks",
] as const;

export type TimelineType = (typeof TIMELINES)[number];
