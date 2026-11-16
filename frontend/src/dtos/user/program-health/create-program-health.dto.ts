import type { ActivityLevel } from "@/constants/user/health/activity-level.constants"; 
import type { DietType } from "@/constants/user/health/diet-type.constants"; 

export interface CreateProgramHealthDTO {
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg?: number;

  activityLevel: ActivityLevel;
  dietType: DietType;

  medicalConditions?: string[];
  allergies?: string[];
  dietaryRestrictions?: string[];

  foodPreferences?: string[];
  dislikedFoods?: string[];

  mealsPerDay?: number;
  dailyWaterIntakeLiters?: number;
  averageSleepHours?: number;

  additionalNotes?: string;
}
