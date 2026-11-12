export enum NutritionistPlanDaySort {
  DAY_ASC = "day_asc",
  DAY_DESC = "day_desc",
  NEWEST = "newest",
  OLDEST = "oldest",
}

export interface NutritionistPlanDayListQueryDTO {
  limit?: number;
  search?: string;
  dayNumber?: number;
  sort?: NutritionistPlanDaySort;
  cursor?: string;
}
