import type { Types } from "mongoose";

import type {
  ActivityValueType,
  ProgramActivityCategory,
} from "../../../models/userProgramDay.model";

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
