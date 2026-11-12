import type { Specialization } from "@/types/nutritionist.types";
import type { PlanSort } from "@/types/plan.types";

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
] satisfies Specialization[];

export const SORT_LABELS: Record<PlanSort, string> = {
  newest: "Newest",
  price_low_to_high: "Price: Low to High",
  price_high_to_low: "Price: High to Low",
  duration_shortest: "Duration: Shortest",
  duration_longest: "Duration: Longest",
};

export const PLAN_TABS = ["all", "published", "draft", "archived"] as const;

export type PlanTab = (typeof PLAN_TABS)[number];

export const PLAN_PAGE_LIMIT = 12;
