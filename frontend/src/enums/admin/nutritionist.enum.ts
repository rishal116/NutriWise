export const LEVELS = ["BEGINNER", "VERIFIED", "EXPERT", "TOP_COACH"] as const;
export type NutritionistLevel = typeof LEVELS[number];