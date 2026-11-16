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