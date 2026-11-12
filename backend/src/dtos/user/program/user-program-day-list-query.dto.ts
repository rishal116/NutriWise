import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

import {
  DAY_TRACKING_STATUSES,
  type DayTrackingStatus,
} from "../../../constants/user/program/day-tracking-status.constants";

export enum UserProgramDaySort {
  DAY_ASC = "day_asc",
  DAY_DESC = "day_desc",
  NEWEST = "newest",
  OLDEST = "oldest",
}

export class UserProgramDayListQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  cursor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsEnum(DAY_TRACKING_STATUSES)
  status?: DayTrackingStatus;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  @IsBoolean()
  locked?: boolean;

  @IsOptional()
  @IsEnum(UserProgramDaySort)
  sort?: UserProgramDaySort;
}
