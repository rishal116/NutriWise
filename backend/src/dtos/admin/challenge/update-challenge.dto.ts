import {
  IsEnum,
  IsInt,
  IsNotEmpty,
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

export class UpdateChallengeDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(3000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  instructions?: string;

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
  @IsInt()
  @Min(1)
  @Max(365)
  durationDays?: number;
}
