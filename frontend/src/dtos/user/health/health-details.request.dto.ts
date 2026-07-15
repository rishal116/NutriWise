import {
  ActivityLevel,
  DietType,
  GoalType,
  TimelineType,
} from "@/types/health.types";

export interface HealthDetailsRequestDto {
  heightCm: number;
  weightKg: number;

  activityLevel: ActivityLevel;
  dietType: DietType;




  goal: GoalType;
  preferredTimeline: TimelineType;

  targetWeightKg?: number;
}