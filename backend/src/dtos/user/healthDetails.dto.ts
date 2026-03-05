import {
  ActivityLevel,
  FitnessLevel,
  DietType,
  GoalType,
  TimelineType,
} from "../../types/health.types";

export class HealthDetailsRequestDTO {
  heightCm!: number;
  weightKg!: number;

  activityLevel?: ActivityLevel;
  fitnessLevel?: FitnessLevel;
  dietType?: DietType;

  allergies?: string[];
  dietaryRestrictions?: string[];
  medicalConditions?: string[];
  injuries?: string[];

  dailyWaterIntakeLiters!: number;
  sleepDurationHours!: number;

  dailyStepGoal?: number;
  workoutDaysPerWeek?: number;
  workoutTimePerSession?: number;

  goal!: GoalType;
  targetWeightKg?: number;
  preferredTimeline!: TimelineType;

  focusAreas?: string[];
}

export class HealthDetailsResponseDTO {
  id!: string;
  heightCm!: number;
  weightKg!: number;
  bmi!: number;

  activityLevel!: string;
  fitnessLevel!: string;
  dietType!: string;

  allergies?: string[];
  dietaryRestrictions?: string[];
  medicalConditions?: string[];
  injuries?: string[];

  dailyWaterIntakeLiters!: number;
  sleepDurationHours!: number;

  dailyStepGoal?: number;
  workoutDaysPerWeek?: number;
  workoutTimePerSession?: number;

  goal!: string;
  targetWeightKg?: number;
  preferredTimeline!: string;

  focusAreas?: string[];

  createdAt!: Date;
  updatedAt!: Date;
}