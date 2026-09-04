import {
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
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

export class CreateChallengeDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(3000)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  instructions?: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsEnum(CHALLENGE_CATEGORIES)
  category!: ChallengeCategory;

  @IsEnum(CHALLENGE_DIFFICULTIES)
  difficulty!: ChallengeDifficulty;

  @IsEnum(CHALLENGE_TYPES)
  type!: ChallengeType;

  @IsEnum(CHALLENGE_ACCESS_TYPES)
  accessType!: ChallengeAccessType;

  @IsEnum(CHALLENGE_VALUE_TYPES)
  valueType!: ChallengeValueType;

  @IsInt()
  @Min(1)
  @Max(365)
  durationDays!: number;

  @ValidateIf(
    (object: CreateChallengeDTO) =>
      object.type === "daily_target" || object.type === "total_target",
  )
  @IsNumber()
  @Min(0)
  targetValue?: number;

  @ValidateIf(
    (object: CreateChallengeDTO) =>
      object.type === "daily_target" || object.type === "total_target",
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  targetUnit?: string;

  @ValidateIf((object: CreateChallengeDTO) => object.type === "completion")
  @IsInt()
  @Min(1)
  targetCount?: number;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rewardPoints?: number;

  @IsOptional()
  @IsMongoId()
  badgeId?: string;
}
