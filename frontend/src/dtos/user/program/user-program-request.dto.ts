export enum UserProgramSort {
  NEWEST = "newest",
  OLDEST = "oldest",
  START_DATE = "start_date",
  END_DATE = "end_date",
  PROGRESS = "progress",
}

export type ProgramStatus =
  | "upcoming"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export interface BrowseUserProgramsRequest {
  limit: number;
  cursor?: string;
  search?: string;
  status?: ProgramStatus;
  sort?: UserProgramSort;
}
