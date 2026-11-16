export const DIET_TYPES = [
  "veg",
  "non_veg",
  "vegan",
  "eggetarian",
  "pescatarian",
  "keto",
  "paleo",
  "mediterranean",
  "jain",
] as const;

export type DietType = (typeof DIET_TYPES)[number];
