export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "active"
  | "very_active";
export const ACTIVITY_LEVELS = [
  "sedentary",
  "lightly_active",
  "moderately_active",
  "active",
  "very_active",
] as const;
export type ActivityLevelType = (typeof ACTIVITY_LEVELS)[number];

export type DietType = "veg" | "non_veg" | "vegan" | "eggetarian";
export const DIET_TYPES = ["veg", "non_veg", "vegan", "eggetarian"] as const;
export type DietTypeEnum = (typeof DIET_TYPES)[number];

export type GoalType =
  | "fitness_weight_loss"
  | "fitness_weight_gain"
  | "muscle_build"
  | "medical_diabetes"
  | "medical_pcos"
  | "lifestyle_general"
  | "mental_wellness";
export const GOALS = [
  "fitness_weight_loss",
  "fitness_weight_gain",
  "muscle_build",
  "medical_diabetes",
  "medical_pcos",
  "lifestyle_general",
  "mental_wellness",
] as const;
export type GoalTypeEnum = (typeof GOALS)[number];

export type FitnessLevel = "beginner" | "intermediate" | "advanced";
export const FITNESS_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type FitnessLevelType = (typeof FITNESS_LEVELS)[number];

export type TimelineType =
  | "4_weeks"
  | "8_weeks"
  | "12_weeks"
  | "16_weeks"
  | "20_weeks"
  | "24_weeks";
export const TIMELINES = [
  "4_weeks",
  "8_weeks",
  "12_weeks",
  "16_weeks",
  "20_weeks",
  "24_weeks",
] as const;
export type TimelineTypeEnum = (typeof TIMELINES)[number];
