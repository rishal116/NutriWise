import {
  ActivityLevel,
  DietType,
  GoalType,
  TimelineType,
} from "../../../types/health.types";

export interface HealthDetailsResponseDto {
  heightCm: number;
  weightKg: number;

  bmi: number;
  activityLevel: ActivityLevel;
  dietType: DietType;

  goal: GoalType;
  targetWeightKg?: number;

  preferredTimeline: TimelineType;
}
