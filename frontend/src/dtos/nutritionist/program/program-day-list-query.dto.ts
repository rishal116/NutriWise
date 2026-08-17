import { ProgramActivityCategory } from "./program-day-response.dto";

export enum ProgramDaySortBy {
  ASC = "asc",
  DESC = "desc",
}

export interface ProgramDayListQueryDTO {
  cursor?: string;

  limit?: number;

  search?: string;

  category?: ProgramActivityCategory;

  sortBy?: ProgramDaySortBy;
}

export interface GetProgramDayParamsDTO {
  programId: string;
}

export interface GetProgramDayDetailsParamsDTO {
  dayId: string;
}
