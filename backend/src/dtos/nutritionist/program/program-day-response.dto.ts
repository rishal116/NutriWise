import { Types } from "mongoose";

import {
  ActivityValueType,
  ProgramActivityCategory,
} from "../../../models/userProgramDay.model";

export interface ProgramActivityResponseDTO {
  _id: Types.ObjectId;

  category: ProgramActivityCategory;

  title: string;

  description?: string;

  instructions?: string;

  valueType: ActivityValueType;

  targetValue?: number;

  unit?: string;

  estimatedDurationMinutes?: number;

  isRequired: boolean;

  configuration?: Record<string, unknown>;

  order: number;
}

export interface ProgramDayResponseDTO {
  userProgramDayId: Types.ObjectId;

  userProgramId: Types.ObjectId;

  dayNumber: number;

  activities: ProgramActivityResponseDTO[];

  createdAt: Date;

  updatedAt: Date;
}
