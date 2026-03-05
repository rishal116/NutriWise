import {
  ActivityLevel,
  FitnessLevel,
  DietType,
  GoalType,
  TimelineType,
} from "@/types/health.types";

export interface HealthDetailsPayload {
  heightCm: number;
  weightKg: number;

  activityLevel: ActivityLevel;
  fitnessLevel: FitnessLevel;
  dietType: DietType;

  dailyWaterIntakeLiters: number;
  sleepDurationHours: number;

  goal: GoalType;
  preferredTimeline: TimelineType;

  targetWeightKg?: number;
  focusAreas?: string[];
}