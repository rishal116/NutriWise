import type { ProgramSortBy, ProgramStatusFilter } from "@/types/program.types";

export interface GetProgramsQueryDTO {
  cursor?: string;
  limit?: number;
  search?: string;
  programStatus?: ProgramStatusFilter;
  sortBy?: ProgramSortBy;
}
