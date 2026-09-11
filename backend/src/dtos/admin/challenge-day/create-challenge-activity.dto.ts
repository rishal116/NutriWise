import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

import {
  CHALLENGE_ACTIVITY_TYPES,
  CHALLENGE_ACTIVITY_VALUE_TYPES,
  ChallengeActivityType,
  ChallengeActivityValueType,
} from "../../../models/challengeDay.model";

export class CreateChallengeActivityDTO {
  @IsEnum(CHALLENGE_ACTIVITY_TYPES)
  type!: ChallengeActivityType;

  @IsString()
  @MaxLength(150)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  instructions?: string;

  @IsEnum(CHALLENGE_ACTIVITY_VALUE_TYPES)
  valueType!: ChallengeActivityValueType;

  @IsOptional()
  @Min(0)
  targetValue?: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  unit?: string;

  @IsOptional()
  @Min(0)
  estimatedDurationMinutes?: number;

  @IsBoolean()
  isRequired!: boolean;

  @IsInt()
  @Min(0)
  order!: number;

  @IsOptional()
  @IsObject()
  configuration?: Record<string, unknown>;
}
