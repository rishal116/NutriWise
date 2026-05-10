import {
  CreateClientProfileDTO,
  UpdateClientProfileDTO,
  ClientProfileResponseDTO,
} from "../../dtos/user/clientProfile.dto";

import { IClientProfile } from "../../models/clientProfile.model";
import { Types } from "mongoose";

export class ClientProfileMapper {
  static toEntity(
    userId: string,
    payload: CreateClientProfileDTO,
    bmi: number,
    profileCompletionPercentage: number,
  ): Partial<IClientProfile> {
    return {
      userId: new Types.ObjectId(userId),

      dateOfBirth: payload.dateOfBirth
        ? new Date(payload.dateOfBirth)
        : undefined,

      gender: payload.gender,

      heightCm: payload.heightCm,
      weightKg: payload.weightKg,

      activityLevel: payload.activityLevel,
      fitnessLevel: payload.fitnessLevel,
      dietType: payload.dietType,

      allergies: payload.allergies || [],
      dietaryRestrictions: payload.dietaryRestrictions || [],
      medicalConditions: payload.medicalConditions || [],
      injuries: payload.injuries || [],

      dailyWaterIntakeLiters: payload.dailyWaterIntakeLiters,
      sleepDurationHours: payload.sleepDurationHours,

      dailyStepGoal: payload.dailyStepGoal,
      workoutDaysPerWeek: payload.workoutDaysPerWeek,
      workoutTimePerSession: payload.workoutTimePerSession,

      goal: payload.goal,
      targetWeightKg: payload.targetWeightKg,

      preferredTimeline: payload.preferredTimeline,
      customTimelineWeeks: payload.customTimelineWeeks,

      focusAreas: payload.focusAreas || [],

      profileCompleted: payload.profileCompleted,
      profileCompletionPercentage,
    };
  }

  static toUpdateEntity(
    payload: UpdateClientProfileDTO,
    bmi?: number,
    profileCompletionPercentage?: number,
  ): Partial<IClientProfile> {
    return {
      ...(payload.dateOfBirth && {
        dateOfBirth: new Date(payload.dateOfBirth),
      }),

      ...(payload.gender && {
        gender: payload.gender,
      }),

      ...(payload.heightCm && {
        heightCm: payload.heightCm,
      }),

      ...(payload.weightKg && {
        weightKg: payload.weightKg,
      }),

      ...(payload.activityLevel && {
        activityLevel: payload.activityLevel,
      }),

      ...(payload.fitnessLevel && {
        fitnessLevel: payload.fitnessLevel,
      }),

      ...(payload.dietType && {
        dietType: payload.dietType,
      }),

      ...(payload.allergies && {
        allergies: payload.allergies,
      }),

      ...(payload.dietaryRestrictions && {
        dietaryRestrictions: payload.dietaryRestrictions,
      }),

      ...(payload.medicalConditions && {
        medicalConditions: payload.medicalConditions,
      }),

      ...(payload.injuries && {
        injuries: payload.injuries,
      }),

      ...(payload.dailyWaterIntakeLiters && {
        dailyWaterIntakeLiters: payload.dailyWaterIntakeLiters,
      }),

      ...(payload.sleepDurationHours && {
        sleepDurationHours: payload.sleepDurationHours,
      }),

      ...(payload.dailyStepGoal && {
        dailyStepGoal: payload.dailyStepGoal,
      }),

      ...(payload.workoutDaysPerWeek && {
        workoutDaysPerWeek: payload.workoutDaysPerWeek,
      }),

      ...(payload.workoutTimePerSession && {
        workoutTimePerSession: payload.workoutTimePerSession,
      }),

      ...(payload.goal && {
        goal: payload.goal,
      }),

      ...(payload.targetWeightKg && {
        targetWeightKg: payload.targetWeightKg,
      }),

      ...(payload.preferredTimeline && {
        preferredTimeline: payload.preferredTimeline,
      }),

      ...(payload.customTimelineWeeks && {
        customTimelineWeeks: payload.customTimelineWeeks,
      }),

      ...(payload.focusAreas && {
        focusAreas: payload.focusAreas,
      }),

      ...(payload.profileCompleted !== undefined && {
        profileCompleted: payload.profileCompleted,
      }),

      ...(profileCompletionPercentage !== undefined && {
        profileCompletionPercentage,
      }),

      ...(bmi !== undefined && {
        bmi,
      }),
    };
  }

  static toResponse(profile: IClientProfile): ClientProfileResponseDTO {
    return {
      _id: profile._id.toString(),
      userId: profile.userId.toString(),

      dateOfBirth: profile.dateOfBirth
        ? profile.dateOfBirth.toISOString()
        : undefined,
      gender: profile.gender,

      heightCm: profile.heightCm,
      weightKg: profile.weightKg,

      activityLevel: profile.activityLevel,
      fitnessLevel: profile.fitnessLevel,
      dietType: profile.dietType,

      allergies: profile.allergies,
      dietaryRestrictions: profile.dietaryRestrictions,
      medicalConditions: profile.medicalConditions,
      injuries: profile.injuries,

      dailyWaterIntakeLiters: profile.dailyWaterIntakeLiters,
      sleepDurationHours: profile.sleepDurationHours,

      dailyStepGoal: profile.dailyStepGoal,
      workoutDaysPerWeek: profile.workoutDaysPerWeek,
      workoutTimePerSession: profile.workoutTimePerSession,

      goal: profile.goal,
      targetWeightKg: profile.targetWeightKg,

      preferredTimeline: profile.preferredTimeline,
      customTimelineWeeks: profile.customTimelineWeeks,

      focusAreas: profile.focusAreas,

      profileCompleted: profile.profileCompleted,
      profileCompletionPercentage: profile.profileCompletionPercentage,
      

      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}
