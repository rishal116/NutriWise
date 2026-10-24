export const PROGRAM_STATUS = [
  "upcoming",
  "active",
  "paused",
  "completed",
  "cancelled",
] as const;

export type ProgramStatus = (typeof PROGRAM_STATUS)[number];

export enum UserProgramSort {
  NEWEST = "newest",
  OLDEST = "oldest",
  START_DATE = "start_date",
  END_DATE = "end_date",
}

export interface UserProgramListQuery {
  limit?: number;
  cursor?: string;
  search?: string;
  programStatus?: ProgramStatus;
  sort?: UserProgramSort;
}
