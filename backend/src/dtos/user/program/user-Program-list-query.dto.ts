import { Type } from "class-transformer";
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

import { PROGRAM_STATUSES } from "../../../constants/user/program/program-status.constants";

export enum UserProgramSort {
  NEWEST = "newest",
  OLDEST = "oldest",
  START_DATE = "start_date",
  END_DATE = "end_date",
}

export class UserProgramListQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;

  @IsOptional()
  @IsString()
  @MinLength(1)
  cursor?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsIn(PROGRAM_STATUSES)
  programStatus?: (typeof PROGRAM_STATUSES)[number];

  @IsOptional()
  @IsEnum(UserProgramSort)
  sort: UserProgramSort = UserProgramSort.NEWEST;
}
