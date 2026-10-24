import type {
  ProgramActivityCategory,
  ActivityValueType,
} from "@/types/program-activity.types";

export interface NutriProgramActivityDTO {
  category: ProgramActivityCategory;
  title: string;
  description?: string;
  instructions?: string;
  valueType: ActivityValueType;
  targetValue?: number;
  unit?: string;
  estimatedDurationMinutes?: number;
  scheduledTime?: string;
  isRequired?: boolean;
  order: number;
}

export interface CreateNutriProgramDayDTO {
  dayNumber: number;
  activities: NutriProgramActivityDTO[];
}

export interface UpdateNutriProgramDayDTO {
  activities?: NutriProgramActivityDTO[];
}
