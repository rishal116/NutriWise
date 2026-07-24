export type ProgramStatusFilter =
  | "all"
  | "upcoming"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export type ProgramSortBy =
  | "latest"
  | "start_date"
  | "end_date"
  | "progress";

export interface GetProgramsQuery {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: ProgramStatusFilter;
  sortBy?: ProgramSortBy;
}