export const AVAILABILITY_STATUSES = ["available", "busy", "offline"] as const;

export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

export const APPLICATION_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const COACH_LEVELS = [
  "beginner",
  "verified",
  "expert",
  "top_coach",
] as const;

export type CoachLevel = (typeof COACH_LEVELS)[number];

export const SPECIALIZATIONS = [
  "weight_loss",
  "weight_gain",
  "sports_nutrition",
  "clinical_nutrition",
  "diabetes_management",
  "pcos_nutrition",
  "renal_nutrition",
  "cardiac_nutrition",
  "gut_health",
  "child_nutrition",
  "pregnancy_nutrition",
  "elderly_nutrition",
  "vegan_nutrition",
  "ketogenic_diet",
  "general_wellness",
] as const;

export type Specialization = (typeof SPECIALIZATIONS)[number];

export const LANGUAGES = [
  "english",
  "hindi",
  "malayalam",
  "tamil",
  "kannada",
  "telugu",
  "marathi",
  "gujarati",
  "bengali",
  "urdu",
] as const;

export type Language = (typeof LANGUAGES)[number];

export const NUTRITIONIST_SORT_OPTIONS = [
  "highest_rating",
  "most_experienced",
  "most_reviewed",
  "newest",
] as const;

export type NutritionistSortBy = (typeof NUTRITIONIST_SORT_OPTIONS)[number];
