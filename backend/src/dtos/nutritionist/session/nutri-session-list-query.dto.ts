import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import {
  SESSION_STATUSES,
  SESSION_TYPES,
} from "../../../constants/common/session.constants";
import type {
  SessionStatus,
  SessionType,
} from "../../../constants/common/session.constants";

export const NUTRI_SESSION_SORT_OPTIONS = [
  "latest",
  "oldest",
  "date_asc",
  "date_desc",
] as const;

export type NutriSessionSortOption =
  (typeof NUTRI_SESSION_SORT_OPTIONS)[number];

export class GetNutriSessionsQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SESSION_STATUSES)
  status?: SessionStatus;

  @IsOptional()
  @IsEnum(SESSION_TYPES)
  type?: SessionType;

  @IsOptional()
  @IsEnum(NUTRI_SESSION_SORT_OPTIONS)
  sortBy?: NutriSessionSortOption;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
