import { ProgramStatus } from "../../../models/userProgram.model";

export enum UserProgramSort {
  NEWEST = "newest",
  OLDEST = "oldest",
  START_DATE = "start_date",
  END_DATE = "end_date",
  PROGRESS = "progress",
}

export interface UserProgramListQueryDTO {
  limit: number;
  cursor?: string;
  search?: string;
  status?: ProgramStatus;
  sort?: UserProgramSort;
}
