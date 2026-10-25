import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from "class-validator";

import {
  ACTIVITY_LEVELS,
  DIET_TYPES,
  GOALS,
  TIMELINES,
  type ActivityLevel,
  type DietType,
  type GoalType,
  type TimelineType,
} from "../../../types/health.types";

import { Gender } from "../../../enums/user.enum";

export class CompleteProfileDto {
  @IsEnum(Gender)
  gender!: Gender;

  @IsDateString()
  birthDate!: string;

  @IsNumber()
  @Min(1)
  @Max(300)
  heightCm!: number;

  @IsNumber()
  @IsPositive()
  @Max(700)
  weightKg!: number;

  @IsEnum(ACTIVITY_LEVELS)
  activityLevel!: ActivityLevel;

  @IsEnum(DIET_TYPES)
  dietType!: DietType;

  @IsEnum(GOALS)
  goal!: GoalType;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(700)
  targetWeightKg?: number;

  @IsOptional()
  @IsEnum(TIMELINES)
  preferredTimeline?: TimelineType;
}
