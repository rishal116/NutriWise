// ================================
// Nutritionist Domain Types
// ================================

export type AvailabilityStatus =
  | "available"
  | "busy"
  | "offline";

export type ApplicationStatus =
  | "pending"
  | "approved"
  | "rejected";

export type CoachLevel =
  | "beginner"
  | "verified"
  | "expert"
  | "top_coach";

export type Specialization =
  | "weight_loss"
  | "weight_gain"
  | "sports_nutrition"
  | "clinical_nutrition"
  | "diabetes_management"
  | "pcos_nutrition"
  | "renal_nutrition"
  | "cardiac_nutrition"
  | "gut_health"
  | "child_nutrition"
  | "pregnancy_nutrition"
  | "elderly_nutrition"
  | "vegan_nutrition"
  | "ketogenic_diet"
  | "general_wellness";

export type Language =
  | "english"
  | "hindi"
  | "malayalam"
  | "tamil"
  | "kannada"
  | "telugu"
  | "marathi"
  | "gujarati"
  | "bengali"
  | "urdu";

export const AVAILABILITY_STATUSES = [
  "available",
  "busy",
  "offline",
] as const;

export const APPLICATION_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;

export const COACH_LEVELS = [
  "beginner",
  "verified",
  "expert",
  "top_coach",
] as const;

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

export type AvailabilityStatusType =
  (typeof AVAILABILITY_STATUSES)[number];

export type ApplicationStatusType =
  (typeof APPLICATION_STATUSES)[number];

export type CoachLevelType =
  (typeof COACH_LEVELS)[number];

export type SpecializationType =
  (typeof SPECIALIZATIONS)[number];

export type LanguageType =
  (typeof LANGUAGES)[number];