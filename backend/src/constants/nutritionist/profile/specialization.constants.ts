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
