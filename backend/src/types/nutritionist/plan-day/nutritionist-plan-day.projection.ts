import type { Types } from "mongoose";

import type { ProgramActivityCategory } from "../../../constants/user/program/program-activity-category.constants";
import type { ActivityValueType } from "../../../constants/user/program/activity-value-type.constants";

export interface NutritionistPlanDayListProjection {
  _id: Types.ObjectId;
  planId: Types.ObjectId;
  dayNumber: number;
  title?: string;
  description?: string;
  totalActivities: number;
  requiredActivities: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionistPlanActivityDetailsProjection {
  _id: Types.ObjectId;
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

export interface NutritionistPlanDayDetailsProjection {
  _id: Types.ObjectId;
  planId: Types.ObjectId;
  dayNumber: number;
  title?: string;
  description?: string;
  activities: NutritionistPlanActivityDetailsProjection[];
  createdAt: Date;
  updatedAt: Date;
}
