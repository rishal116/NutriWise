export const PROGRAM_STATUS = [
  "upcoming",
  "active",
  "paused",
  "completed",
  "cancelled",
] as const;

export type ProgramStatus = (typeof PROGRAM_STATUS)[number];

export const PROGRAM_STATUS_FILTER = ["all", ...PROGRAM_STATUS] as const;

export type ProgramStatusFilter = (typeof PROGRAM_STATUS_FILTER)[number];

export enum ProgramSortBy {
  LATEST = "latest",
  OLDEST = "oldest",
  START_DATE = "start_date",
  END_DATE = "end_date",
  PROGRESS = "progress",
}
