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
  customTimelineWeeks?: number;

  focusAreas?: string[];

  allergies?: string[];
  dietaryRestrictions?: string[];
  medicalConditions?: string[];
  injuries?: string[];

  dailyStepGoal?: number;
  workoutDaysPerWeek?: number;
  workoutTimePerSession?: number;
}