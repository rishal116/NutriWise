import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

import {
  CHALLENGE_ACCESS_TYPES,
  CHALLENGE_CATEGORIES,
  CHALLENGE_DIFFICULTIES,
  CHALLENGE_STATUSES,
  CHALLENGE_TYPES,
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeStatus,
  ChallengeType,
} from "../../../models/challenge.model";

export const ADMIN_CHALLENGE_SORT_OPTIONS = [
  "newest",
  "oldest",
  "start_date_asc",
  "start_date_desc",
] as const;

export type AdminChallengeSortBy =
  (typeof ADMIN_CHALLENGE_SORT_OPTIONS)[number];

export class AdminChallengeListQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(CHALLENGE_CATEGORIES)
  category?: ChallengeCategory;

  @IsOptional()
  @IsEnum(CHALLENGE_DIFFICULTIES)
  difficulty?: ChallengeDifficulty;

  @IsOptional()
  @IsEnum(CHALLENGE_TYPES)
  type?: ChallengeType;

  @IsOptional()
  @IsEnum(CHALLENGE_ACCESS_TYPES)
  accessType?: ChallengeAccessType;

  @IsOptional()
  @IsEnum(CHALLENGE_STATUSES)
  status?: ChallengeStatus;

  @IsOptional()
  @IsEnum(ADMIN_CHALLENGE_SORT_OPTIONS)
  sortBy?: AdminChallengeSortBy;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  limit?: number;
}
