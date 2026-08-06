import { ProgramStatus } from "../../../models/userProgram.model";
import { SubscriptionStatus } from "../../../models/userPlan.model";

export enum UserProgramSort {
  NEWEST = "newest",
  OLDEST = "oldest",
  START_DATE = "start_date",
  END_DATE = "end_date",
}

export interface UserProgramListQueryDTO {
  limit: number;
  cursor?: string;
  search?: string;
  programStatus?: ProgramStatus;
  subscriptionStatus?: SubscriptionStatus;
  sort?: UserProgramSort;
}
