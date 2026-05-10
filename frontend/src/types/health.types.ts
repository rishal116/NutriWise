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
  | "vegetarian"
  | "non_vegetarian"
  | "vegan"
  | "eggetarian";

export type GoalType =
  | "weight_loss"
  | "weight_gain"
  | "muscle_build"
  | "diabetes_management"
  | "pcos_management"
  | "general_fitness"
  | "mental_wellness"
  | "gut_health"
  | "sports_performance";

export type TimelineType =
  | "4_weeks"
  | "8_weeks"
  | "12_weeks"
  | "24_weeks"
  | "custom";

// ================================
// Enum Arrays (Mongoose Compatible)
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
  "vegetarian",
  "non_vegetarian",
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
  "mental_wellness",
  "gut_health",
  "sports_performance",
] as const;

export const TIMELINES = [
  "4_weeks",
  "8_weeks",
  "12_weeks",
  "24_weeks",
  "custom",
] as const;

// ================================
// UI Label Helpers
// ================================

export const GOAL_LABELS: Record<GoalType, string> = {
  weight_loss: "Weight Loss",
  weight_gain: "Weight Gain",
  muscle_build: "Muscle Building",
  diabetes_management: "Diabetes Management",
  pcos_management: "PCOS Management",
  general_fitness: "General Fitness",
  mental_wellness: "Mental Wellness",
  gut_health: "Gut Health",
  sports_performance: "Sports Performance",
};

export const DIET_LABELS: Record<DietType, string> = {
  vegetarian: "Vegetarian",
  non_vegetarian: "Non-Vegetarian",
  vegan: "Vegan",
  eggetarian: "Eggetarian",
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary",
  light: "Light Activity",
  moderate: "Moderate Activity",
  active: "Active",
  very_active: "Very Active",
};

export const FITNESS_LABELS: Record<FitnessLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const TIMELINE_LABELS: Record<TimelineType, string> = {
  "4_weeks": "4 Weeks",
  "8_weeks": "8 Weeks",
  "12_weeks": "12 Weeks",
  "24_weeks": "24 Weeks",
  custom: "Custom Timeline",
};

// ================================
// Utility Validation Helpers
// ================================

export const isValidGoal = (goal: string): goal is GoalType =>
  GOALS.includes(goal as GoalType);

export const isValidDietType = (diet: string): diet is DietType =>
  DIET_TYPES.includes(diet as DietType);

export const isValidActivityLevel = (
  level: string
): level is ActivityLevel =>
  ACTIVITY_LEVELS.includes(level as ActivityLevel);

export const isValidFitnessLevel = (
  level: string
): level is FitnessLevel =>
  FITNESS_LEVELS.includes(level as FitnessLevel);

export const isValidTimeline = (
  timeline: string
): timeline is TimelineType =>
  TIMELINES.includes(timeline as TimelineType);