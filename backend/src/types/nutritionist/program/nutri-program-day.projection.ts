import { Types } from "mongoose";

import type { ProgramActivityCategory } from "../../../constants/user/program/program-activity-category.constants";
import type { ActivityValueType } from "../../../constants/user/program/activity-value-type.constants";

export interface INutriProgramActivityProjection {
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

export interface INutriProgramDayProjection {
  _id: Types.ObjectId;
  userProgramId: Types.ObjectId;
  dayNumber: number;
  activities: INutriProgramActivityProjection[];
}
