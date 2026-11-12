export interface NutritionistPlanDayListItemDTO {
  id: string;
  planId: string;
  dayNumber: number;
  title?: string;
  description?: string;
  totalActivities: number;
  requiredActivities: number;
  createdAt: Date;
  updatedAt: Date;
}
