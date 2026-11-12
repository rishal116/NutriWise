import { NutritionistPlanDaySort } from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-list-query.dto";

export type NutritionistPlanDaySortField = "dayNumber" | "createdAt";

export interface NutritionistPlanDaySortConfig {
  field: NutritionistPlanDaySortField;
  order: 1 | -1;
}

export const NUTRITIONIST_PLAN_DAY_SORT_FIELD_MAP = {
  [NutritionistPlanDaySort.DAY_ASC]: {
    field: "dayNumber",
    order: 1,
  },
  [NutritionistPlanDaySort.DAY_DESC]: {
    field: "dayNumber",
    order: -1,
  },
  [NutritionistPlanDaySort.NEWEST]: {
    field: "createdAt",
    order: -1,
  },
  [NutritionistPlanDaySort.OLDEST]: {
    field: "createdAt",
    order: 1,
  },
} satisfies Record<NutritionistPlanDaySort, NutritionistPlanDaySortConfig>;
