import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

import {
  SESSION_PRICING_TYPES,
  SESSION_TYPES,
  SessionPricingType,
  SessionType,
} from "../../../models/session.model";

export const PUBLIC_SESSION_SORT_OPTIONS = [
  "latest",
  "oldest",
  "upcoming",
  "price_low_to_high",
  "price_high_to_low",
] as const;

export type PublicSessionSortOption =
  (typeof PUBLIC_SESSION_SORT_OPTIONS)[number];

export class PublicSessionListQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SESSION_TYPES)
  type?: SessionType;

  @IsOptional()
  @IsEnum(SESSION_PRICING_TYPES)
  pricingType?: SessionPricingType;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 12;

  @IsOptional()
  @IsEnum(PUBLIC_SESSION_SORT_OPTIONS)
  sortBy: PublicSessionSortOption = "upcoming";
}
