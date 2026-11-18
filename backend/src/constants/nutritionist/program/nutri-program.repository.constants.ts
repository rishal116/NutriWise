import { ProgramSortBy } from "../../../dtos/nutritionist/program/nutri-program-request.dto";

export const PROGRAM_SORT_CONFIG: Record<
  ProgramSortBy,
  { field: string; direction: 1 | -1 }
> = {
  [ProgramSortBy.LATEST]: {
    field: "createdAt",
    direction: -1,
  },
  [ProgramSortBy.OLDEST]: {
    field: "createdAt",
    direction: 1,
  },
  [ProgramSortBy.START_DATE]: {
    field: "startDate",
    direction: -1,
  },
  [ProgramSortBy.END_DATE]: {
    field: "endDate",
    direction: -1,
  },
  [ProgramSortBy.PROGRESS]: {
    field: "completionPercentage",
    direction: -1,
  },
};
