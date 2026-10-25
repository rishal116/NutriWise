import { Transform, Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

import {
  COACH_LEVELS,
  type CoachLevel,
} from "../../../types/nutritionist.types";

export const ADMIN_NUTRITIONIST_SORT_OPTIONS = ["newest", "oldest"] as const;

export type AdminNutritionistSortBy =
  (typeof ADMIN_NUTRITIONIST_SORT_OPTIONS)[number];

export class AdminNutritionistListQueryDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsIn(COACH_LEVELS)
  coachLevel?: CoachLevel;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  @IsIn([true, false])
  isBlocked?: boolean;

  @IsOptional()
  @IsIn(ADMIN_NUTRITIONIST_SORT_OPTIONS)
  sortBy?: AdminNutritionistSortBy;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
