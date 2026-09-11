import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

import {
  APPLICATION_STATUSES,
  ApplicationStatus,
} from "../../../types/nutritionist.types";

export const ADMIN_NUTRITIONIST_APPLICATION_SORT_OPTIONS = [
  "newest",
  "oldest",
] as const;

export type AdminNutritionistApplicationSortBy =
  (typeof ADMIN_NUTRITIONIST_APPLICATION_SORT_OPTIONS)[number];

export class AdminNutritionistApplicationListQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(APPLICATION_STATUSES)
  applicationStatus?: ApplicationStatus;

  @IsOptional()
  @IsEnum(ADMIN_NUTRITIONIST_APPLICATION_SORT_OPTIONS)
  sortBy?: AdminNutritionistApplicationSortBy;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  limit?: number;
}
