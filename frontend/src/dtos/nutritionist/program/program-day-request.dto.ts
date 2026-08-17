export const PROGRAM_ACTIVITY_CATEGORIES = [
  "meal",
  "exercise",
  "habit",
  "water",
  "supplement",
  "meditation",
  "sleep",
  "reading",
  "appointment",
  "measurement",
  "task",
  "custom",
] as const;

export type ProgramActivityCategory =
  (typeof PROGRAM_ACTIVITY_CATEGORIES)[number];

export const ACTIVITY_VALUE_TYPES = [
  "boolean",
  "number",
  "duration",
  "photo",
  "text",
] as const;

export type ActivityValueType = (typeof ACTIVITY_VALUE_TYPES)[number];

export interface ProgramActivityDTO {
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
  configuration?: Record<string, unknown>;
  order: number;
}

export interface CreateProgramDayDTO {
  dayNumber: number;
  activities: ProgramActivityDTO[];
}

export interface UpdateProgramDayDTO {
  activities?: ProgramActivityDTO[];
}
