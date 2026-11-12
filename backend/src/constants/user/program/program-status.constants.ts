export const PROGRAM_STATUSES = [
  "preparing",
  "ready",
  "upcoming",
  "active",
  "paused",
  "completed",
  "cancelled",
] as const;

export type ProgramStatus = (typeof PROGRAM_STATUSES)[number];