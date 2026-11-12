import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MaxLength,
} from "class-validator";

import { PROGRAM_STATUSES } from "../../../constants/user/program/program-status.constants";

export const PROGRAM_STATUS_FILTER = ["all", ...PROGRAM_STATUSES] as const;

export type ProgramStatusFilter = (typeof PROGRAM_STATUS_FILTER)[number];

export enum ProgramSortBy {
  LATEST = "latest",
  OLDEST = "oldest",
  START_DATE = "start_date",
  END_DATE = "end_date",
  PROGRESS = "progress",
}

export class GetProgramsQueryDTO {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsEnum(PROGRAM_STATUS_FILTER)
  programStatus: ProgramStatusFilter = "all";

  @IsOptional()
  @IsEnum(ProgramSortBy)
  sortBy: ProgramSortBy = ProgramSortBy.LATEST;
}

export class GetProgramParamsDTO {
  @IsString()
  programId!: string;
}
