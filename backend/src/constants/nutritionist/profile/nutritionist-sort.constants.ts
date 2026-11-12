export const NUTRITIONIST_SORT_OPTIONS = [
  "highest_rating",
  "most_experienced",
  "most_reviewed",
  "newest",
] as const;

export type NutritionistSortBy = (typeof NUTRITIONIST_SORT_OPTIONS)[number];
