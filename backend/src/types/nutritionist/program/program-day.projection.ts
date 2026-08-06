import { Types } from "mongoose";
import {
  ProgramActivityCategory,
  ActivityValueType,
} from "../../../models/userProgramDay.model";

export interface IProgramActivityProjection {
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

export interface IProgramDayProjection {
  _id: Types.ObjectId;

  userProgramId: Types.ObjectId;

  dayNumber: number;

  activities: IProgramActivityProjection[];

  createdAt: Date;

  updatedAt: Date;
}
