import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

import {
  CHALLENGE_ACCESS_TYPES,
  CHALLENGE_CATEGORIES,
  CHALLENGE_DIFFICULTIES,
  CHALLENGE_STATUSES,
  type ChallengeAccessType,
  type ChallengeCategory,
  type ChallengeDifficulty,
  type ChallengeStatus,
} from "../../../models/challenge.model";

export const ADMIN_CHALLENGE_SORT_OPTIONS = ["newest", "oldest"] as const;

export type AdminChallengeSortBy =
  (typeof ADMIN_CHALLENGE_SORT_OPTIONS)[number];

export class AdminChallengeListQueryDTO {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  search?: string;

  @IsOptional()
  @IsEnum(CHALLENGE_CATEGORIES)
  category?: ChallengeCategory;

  @IsOptional()
  @IsEnum(CHALLENGE_DIFFICULTIES)
  difficulty?: ChallengeDifficulty;

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
  @MinLength(1)
  @MaxLength(200)
  cursor?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  limit?: number;
}
