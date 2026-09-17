import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

import {
  CHALLENGE_ACCESS_TYPES,
  CHALLENGE_CATEGORIES,
  CHALLENGE_DIFFICULTIES,
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
} from "../../../models/challenge.model";

export const PUBLIC_CHALLENGE_SORT_OPTIONS = ["newest", "oldest"] as const;

export type PublicChallengeSort =
  (typeof PUBLIC_CHALLENGE_SORT_OPTIONS)[number];

export class PublicChallengeListQueryDTO {
  @IsOptional()
  @IsString()
  @MaxLength(100)
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
  @IsEnum(PUBLIC_CHALLENGE_SORT_OPTIONS)
  sortBy?: PublicChallengeSort;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(30)
  limit?: number;
}
