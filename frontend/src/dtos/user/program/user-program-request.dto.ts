import type { ProgramStatus } from "../../../constants/user/program/program-status.constants";
import type { UserProgramSort } from "../../../constants/user/program/user-program-sort.constants";

export interface UserProgramListQuery {
  limit?: number;
  cursor?: string;
  search?: string;
  programStatus?: ProgramStatus;
  sort?: UserProgramSort;
}