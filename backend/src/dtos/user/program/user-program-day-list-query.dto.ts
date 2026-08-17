import { UserDayTrackingStatus } from "../../../models/userDayTracking.model";

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
