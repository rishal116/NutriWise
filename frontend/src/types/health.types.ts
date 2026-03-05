// ================================
// Health Domain Types
// ================================

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type FitnessLevel =
  | "beginner"
  | "intermediate"
  | "advanced";

export type DietType =
  | "veg"
  | "non_veg"
  | "vegan"
  | "eggetarian";

export type GoalType =
  | "weight_loss"
  | "weight_gain"
  | "muscle_build"
  | "diabetes_management"
  | "pcos_management"
  | "general_fitness"
  | "meditation";

// ================================
// Enum Arrays (for mongoose)
// ================================

export const ACTIVITY_LEVELS = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
] as const;

export const FITNESS_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export const DIET_TYPES = [
  "veg",
  "non_veg",
  "vegan",
  "eggetarian",
] as const;

export const GOALS = [
  "weight_loss",
  "weight_gain",
  "muscle_build",
  "diabetes_management",
  "pcos_management",
  "general_fitness",
  "meditation",
] as const;

export const TIMELINES = [
  "4_WEEKS",
  "8_WEEKS",
  "12_WEEKS",
  "24_WEEKS",
  "CUSTOM",
] as const;

export type TimelineType = (typeof TIMELINES)[number];