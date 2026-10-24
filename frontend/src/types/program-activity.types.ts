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