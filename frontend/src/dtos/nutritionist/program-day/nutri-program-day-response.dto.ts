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
] as const;

export type NutriProgramActivityCategory =
  (typeof PROGRAM_ACTIVITY_CATEGORIES)[number];

export const ACTIVITY_VALUE_TYPES = [
  "boolean",
  "number",
  "duration",
  "photo",
  "text",
] as const;

export type NutriActivityValueType = (typeof ACTIVITY_VALUE_TYPES)[number];

export interface NutriProgramActivityResponseDTO {
  _id: string;
  category: NutriProgramActivityCategory;
  title: string;
  description?: string;
  instructions?: string;
  valueType: NutriActivityValueType;
  targetValue?: number;
  unit?: string;
  estimatedDurationMinutes?: number;
  scheduledTime?: string;
  isRequired: boolean;
  order: number;
}

export interface NutriProgramDayResponseDTO {
  userProgramDayId: string;
  userProgramId: string;
  dayNumber: number;
  activities: NutriProgramActivityResponseDTO[];
}
