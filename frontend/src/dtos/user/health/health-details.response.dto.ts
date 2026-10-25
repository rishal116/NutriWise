import {
  ActivityLevel,
  DietType,
  GoalType,
  TimelineType,
} from "@/types/health/health.types";

export interface HealthDetailsResponseDto {
  heightCm: number;
  weightKg: number;
  bmi: number;

  activityLevel: ActivityLevel;
  dietType: DietType;

  goal: GoalType;
  preferredTimeline: TimelineType;

  targetWeightKg?: number;
}