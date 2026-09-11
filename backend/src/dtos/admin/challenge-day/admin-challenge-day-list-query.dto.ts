import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export const ADMIN_CHALLENGE_DAY_SORT_OPTIONS = [
  "day_asc",
  "day_desc",
] as const;

export type AdminChallengeDaySortBy =
  (typeof ADMIN_CHALLENGE_DAY_SORT_OPTIONS)[number];

export class AdminChallengeDayListQueryDTO {
  @IsOptional()
  @IsEnum(ADMIN_CHALLENGE_DAY_SORT_OPTIONS)
  sortBy?: AdminChallengeDaySortBy;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  limit?: number;
}
