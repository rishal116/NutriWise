import type { Types } from "mongoose";
import { ProgramActivityCategory } from "../../../constants/user/program/program-activity-category.constants";
import { ActivityValueType } from "../../../constants/user/program/activity-value-type.constants";

export interface INutriProgramActivityResponseDTO {
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

export interface INutriProgramDayResponseDTO {
  userProgramDayId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  dayNumber: number;
  activities: INutriProgramActivityResponseDTO[];
}
