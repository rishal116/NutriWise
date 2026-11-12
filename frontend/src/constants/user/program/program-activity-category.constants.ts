
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
