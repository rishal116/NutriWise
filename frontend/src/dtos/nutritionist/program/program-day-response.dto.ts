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

export interface ProgramActivityResponseDTO {
  _id: string;

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

  configuration?: Record<string, unknown>;

  order: number;
}

export interface ProgramDayResponseDTO {
  userProgramDayId: string;

  userProgramId: string;

  dayNumber: number;

  activities: ProgramActivityResponseDTO[];

  createdAt: string;

  updatedAt: string;
}
