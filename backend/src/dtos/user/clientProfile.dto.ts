// ================================
// CLIENT PROFILE DTOs
// File: dtos/user/clientProfile.dto.ts
// ================================

import {
  ActivityLevel,
  FitnessLevel,
  DietType,
  GoalType,
  TimelineType,
} from "../../types/health.types";

// ================================
// CREATE DTO
// ================================
export interface CreateClientProfileDTO {
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
  customTimelineWeeks?: number;

  focusAreas?: string[];

  profileCompleted?: boolean;
  profileCompletionPercentage?: number;
}

// ================================
// UPDATE DTO
// ================================
export type UpdateClientProfileDTO = Partial<CreateClientProfileDTO>;

// ================================
// PROFILE COMPLETION DTO
// ================================
export interface UpdateProfileCompletionDTO {
  profileCompleted: boolean;
  profileCompletionPercentage?: number;
}

// ================================
// RESPONSE DTO
// ================================
export interface ClientProfileResponseDTO {
  _id: string;
  userId: string;

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
  customTimelineWeeks?: number;

  focusAreas?: string[];

  profileCompleted: boolean;
  profileCompletionPercentage?: number;

  createdAt: string;
  updatedAt: string;
}