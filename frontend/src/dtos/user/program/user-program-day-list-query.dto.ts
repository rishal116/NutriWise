export enum UserDayTrackingStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  MISSED = "missed",
  SKIPPED = "skipped",
}

export enum UserProgramDaySort {
  DAY_ASC = "day_asc",
  DAY_DESC = "day_desc",
  NEWEST = "newest",
  OLDEST = "oldest",
}

export interface UserProgramDayListQueryDTO {
  limit?: number;
  cursor?: string;
  search?: string;
  status?: UserDayTrackingStatus;
  locked?: boolean;
  sort?: UserProgramDaySort;
}