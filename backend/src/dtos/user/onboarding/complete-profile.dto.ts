import { IsDateString, IsIn, IsNumber, IsOptional } from "class-validator";

import {
  ActivityLevel,
  DietType,
  GoalType,
  TimelineType,
  ACTIVITY_LEVELS,
  DIET_TYPES,
  GOALS,
  TIMELINES,
} from "../../../types/health.types";

import { Gender } from "../../../enums/user.enum";

export class CompleteProfileDto {
  @IsIn(Object.values(Gender))
  gender!: Gender;

  @IsDateString()
  birthDate!: string;

  @IsNumber()
  heightCm!: number;

  @IsNumber()
  weightKg!: number;

  @IsIn(ACTIVITY_LEVELS)
  activityLevel!: ActivityLevel;

  @IsIn(DIET_TYPES)
  dietType!: DietType;

  @IsIn(GOALS)
  goal!: GoalType;

  @IsOptional()
  @IsNumber()
  targetWeightKg?: number;

  @IsIn(TIMELINES)
  preferredTimeline!: TimelineType;
}
