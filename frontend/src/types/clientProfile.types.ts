import {
  ActivityLevel,
  FitnessLevel,
  DietType,
  GoalType,
  TimelineType,
} from "@/types/health.types";

export interface ClientProfilePayload {
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";

  heightCm: number;
  weightKg: number;

  activityLevel: ActivityLevel;
  fitnessLevel: FitnessLevel;
  dietType: DietType;

  allergies?: string[];
  dietaryRestrictions?: string[];
  medicalConditions?: string[];
  injuries?: string[];

  dailyWaterIntakeLiters: number;
  sleepDurationHours: number;

  dailyStepGoal?: number;
  workoutDaysPerWeek?: number;
  workoutTimePerSession?: number;

  goal: GoalType;
  targetWeightKg?: number;
  preferredTimeline: TimelineType;

  customTimelineWeeks?: string;

  focusAreas?: string[];

  profileCompleted?: boolean;
}
