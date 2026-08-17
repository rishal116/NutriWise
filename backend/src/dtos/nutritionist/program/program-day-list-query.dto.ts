import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

import { PROGRAM_ACTIVITY_CATEGORIES } from "../../../models/userProgramDay.model";

export enum ProgramDaySortBy {
  ASC = "asc",
  DESC = "desc",
}

export type ProgramActivityCategoryFilter =
  (typeof PROGRAM_ACTIVITY_CATEGORIES)[number];

export class ProgramDayListQueryDTO {
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
  search?: string;

  @IsOptional()
  @IsEnum(PROGRAM_ACTIVITY_CATEGORIES)
  category?: ProgramActivityCategoryFilter;

  @IsOptional()
  @IsEnum(ProgramDaySortBy)
  sortBy: ProgramDaySortBy = ProgramDaySortBy.ASC;
}
