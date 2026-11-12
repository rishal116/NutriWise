import type { SortOrder } from "mongoose";
import type { GetPlansDTO } from "../../../dtos/nutritionist/plan/get-plans.dto";

export type NutritionistPlanSortField = "price" | "durationDays" | "_id";

export type NutritionistPlanSort = NonNullable<GetPlansDTO["sort"]>;

export interface NutritionistPlanSortConfig {
  field: NutritionistPlanSortField;
  direction: 1 | -1;
  sort: Record<string, SortOrder>;
}

export const NUTRITIONIST_PLAN_SORT_CONFIG = {
  newest: {
    field: "_id",
    direction: -1,
    sort: { _id: -1 },
  },
  price_low_to_high: {
    field: "price",
    direction: 1,
    sort: { price: 1, _id: 1 },
  },
  price_high_to_low: {
    field: "price",
    direction: -1,
    sort: { price: -1, _id: -1 },
  },
  duration_shortest: {
    field: "durationDays",
    direction: 1,
    sort: { durationDays: 1, _id: 1 },
  },
  duration_longest: {
    field: "durationDays",
    direction: -1,
    sort: { durationDays: -1, _id: -1 },
  },
} satisfies Record<NutritionistPlanSort, NutritionistPlanSortConfig>;

export const DEFAULT_NUTRITIONIST_PLAN_SORT: NutritionistPlanSortConfig = {
  field: "_id",
  direction: -1,
  sort: { _id: -1 },
};
