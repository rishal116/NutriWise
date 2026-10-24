import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  MaxLength,
} from "class-validator";

import type { ProgramStatus } from "../../../models/userProgram.model";

export enum UserProgramSort {
  NEWEST = "newest",
  OLDEST = "oldest",
  START_DATE = "start_date",
  END_DATE = "end_date",
}

export class UserProgramListQueryDTO {
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
  @IsEnum(["upcoming", "active", "paused", "completed", "cancelled"])
  programStatus?: ProgramStatus;

  @IsOptional()
  @IsEnum(UserProgramSort)
  sort?: UserProgramSort = UserProgramSort.NEWEST;
}
