import { Types } from "mongoose";
import { IHealthDetails } from "../../models/healthDetails.model";
import {
  HealthDetailsRequestDTO,
  HealthDetailsResponseDTO,
} from "../../dtos/user/healthDetails.dto";

export class HealthDetailsMapper {
  static toEntity(
    userId: string,
    dto: HealthDetailsRequestDTO,
    bmi: number
  ): Partial<IHealthDetails> {
    return {
      userId: new Types.ObjectId(userId),

      heightCm: dto.heightCm,
      weightKg: dto.weightKg,
      bmi,

      activityLevel: dto.activityLevel,
      fitnessLevel: dto.fitnessLevel,
      dietType: dto.dietType,

      allergies: dto.allergies,
      dietaryRestrictions: dto.dietaryRestrictions,
      medicalConditions: dto.medicalConditions,
      injuries: dto.injuries,

      dailyWaterIntakeLiters: dto.dailyWaterIntakeLiters,
      sleepDurationHours: dto.sleepDurationHours,

      dailyStepGoal: dto.dailyStepGoal,
      workoutDaysPerWeek: dto.workoutDaysPerWeek,
      workoutTimePerSession: dto.workoutTimePerSession,

      goal: dto.goal,
      targetWeightKg: dto.targetWeightKg,
      preferredTimeline: dto.preferredTimeline,

      focusAreas: dto.focusAreas,
    };
  }

  static toResponse(entity: IHealthDetails): HealthDetailsResponseDTO {
    return {
      id: entity._id.toString(),

      heightCm: entity.heightCm,
      weightKg: entity.weightKg,
      bmi: entity.bmi ?? 0,

      activityLevel: entity.activityLevel,
      fitnessLevel: entity.fitnessLevel,
      dietType: entity.dietType,

      allergies: entity.allergies,
      dietaryRestrictions: entity.dietaryRestrictions,
      medicalConditions: entity.medicalConditions,
      injuries: entity.injuries,

      dailyWaterIntakeLiters: entity.dailyWaterIntakeLiters,
      sleepDurationHours: entity.sleepDurationHours,

      dailyStepGoal: entity.dailyStepGoal,
      workoutDaysPerWeek: entity.workoutDaysPerWeek,
      workoutTimePerSession: entity.workoutTimePerSession,

      goal: entity.goal,
      targetWeightKg: entity.targetWeightKg,
      preferredTimeline: entity.preferredTimeline,

      focusAreas: entity.focusAreas,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}