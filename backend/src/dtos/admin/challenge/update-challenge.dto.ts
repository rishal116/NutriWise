import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from "class-validator";

import {
  CHALLENGE_ACCESS_TYPES,
  CHALLENGE_CATEGORIES,
  CHALLENGE_DIFFICULTIES,
  CHALLENGE_TYPES,
  CHALLENGE_VALUE_TYPES,
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeType,
  ChallengeValueType,
} from "../../../models/challenge.model";

export class UpdateChallengeDTO {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  instructions?: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

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
  @IsEnum(CHALLENGE_VALUE_TYPES)
  valueType?: ChallengeValueType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  durationDays?: number;

  @ValidateIf(
    (object: UpdateChallengeDTO) =>
      object.type === "daily_target" ||
      object.type === "total_target" ||
      object.targetValue !== undefined,
  )
  @IsNumber()
  @Min(0)
  targetValue?: number;

  @ValidateIf(
    (object: UpdateChallengeDTO) =>
      object.type === "daily_target" ||
      object.type === "total_target" ||
      object.targetUnit !== undefined,
  )
  @IsString()
  @MaxLength(30)
  targetUnit?: string;

  @ValidateIf(
    (object: UpdateChallengeDTO) =>
      object.type === "completion" ||
      object.targetCount !== undefined,
  )
  @IsInt()
  @Min(1)
  targetCount?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rewardPoints?: number;

  @IsOptional()
  @IsString()
  badgeId?: string;
}