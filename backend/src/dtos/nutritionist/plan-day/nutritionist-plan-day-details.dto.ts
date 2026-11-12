import { ActivityValueType } from "../../../constants/user/program/activity-value-type.constants";
import { ProgramActivityCategory } from "../../../constants/user/program/program-activity-category.constants";

export interface NutritionistPlanActivityDetailsDTO {
  id: string;
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

export interface NutritionistPlanDayDetailsDTO {
  id: string;
  planId: string;
  dayNumber: number;
  title?: string;
  description?: string;
  activities: NutritionistPlanActivityDetailsDTO[];
  createdAt: Date;
  updatedAt: Date;
}
