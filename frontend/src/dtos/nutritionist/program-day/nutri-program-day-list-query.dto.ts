export enum ProgramDaySortBy {
  ASC = "asc",
  DESC = "desc",
}

export interface ProgramDayListQueryDTO {
  cursor?: string;
  limit?: number;
  sortBy?: ProgramDaySortBy;
}
