import type { IProgramHealth } from "../../../models/programHealth.model";
import type { IProgramHealthResponseDTO } from "../../../dtos/user/program-health/program-health-response.dto";

export class ProgramHealthMapper {
  static toResponse(programHealth: IProgramHealth): IProgramHealthResponseDTO {
    return {
      id: programHealth._id.toString(),
      userProgramId: programHealth.userProgramId.toString(),

      heightCm: programHealth.heightCm,
      currentWeightKg: programHealth.currentWeightKg,
      targetWeightKg: programHealth.targetWeightKg,

      activityLevel: programHealth.activityLevel,
      dietType: programHealth.dietType,

      medicalConditions: programHealth.medicalConditions,
      allergies: programHealth.allergies,
      dietaryRestrictions: programHealth.dietaryRestrictions,

      foodPreferences: programHealth.foodPreferences,
      dislikedFoods: programHealth.dislikedFoods,

      mealsPerDay: programHealth.mealsPerDay,
      dailyWaterIntakeLiters: programHealth.dailyWaterIntakeLiters,
      averageSleepHours: programHealth.averageSleepHours,

      additionalNotes: programHealth.additionalNotes,

      submittedAt: programHealth.submittedAt,
      updatedAt: programHealth.updatedAt,
    };
  }
}
