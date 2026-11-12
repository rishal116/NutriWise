import type { ActivityValueType } from "@/constants/user/program/activity-value-type.constants";
import type { ProgramActivityCategory } from "@/constants/user/program/program-activity-category.constants";

export interface NutritionistPlanActivityDTO {
  category: ProgramActivityCategory;
  title: string;
  description?: string;
  instructions?: string;
  valueType: ActivityValueType;
  targetValue?: number;
  unit?: string;
  estimatedDurationMinutes?: number;
  scheduledTime?: string;
  isRequired: boolean;
  order: number;
}

export interface CreateNutritionistPlanDayDTO {
  dayNumber: number;
  title?: string;
  description?: string;
  activities: NutritionistPlanActivityDTO[];
}

export interface UpdateNutritionistPlanDayDTO {
  title?: string;
  description?: string;
  activities?: NutritionistPlanActivityDTO[];
}
