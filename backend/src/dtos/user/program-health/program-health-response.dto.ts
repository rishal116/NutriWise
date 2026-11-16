import type { ActivityLevel, DietType } from "../../../types/health.types";

export interface IProgramHealthResponseDTO {
  id: string;
  userProgramId: string;

  heightCm: number;
  currentWeightKg: number;
  targetWeightKg?: number;

  activityLevel: ActivityLevel;
  dietType: DietType;

  medicalConditions: string[];
  allergies: string[];
  dietaryRestrictions: string[];

  foodPreferences: string[];
  dislikedFoods: string[];

  mealsPerDay?: number;
  dailyWaterIntakeLiters?: number;
  averageSleepHours?: number;

  additionalNotes?: string;

  submittedAt: Date;
  updatedAt: Date;
}
