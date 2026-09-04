import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

import { Type } from "class-transformer";

import {
  SESSION_PRICING_TYPES,
  SESSION_STATUSES,
  SESSION_TYPES,
  SessionPricingType,
  SessionStatus,
  SessionType,
} from "../../../models/session.model";

export const NUTRI_SESSION_SORT_OPTIONS = [
  "latest",
  "oldest",
  "title_asc",
  "title_desc",
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
  @IsEnum(SESSION_PRICING_TYPES)
  pricingType?: SessionPricingType;

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
