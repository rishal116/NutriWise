import type {
  ClientDetailsResponseDTO,
  ClientHealthDetailsDTO,
  ClientProgramSummaryDTO,
} from "../../../dtos/nutritionist/client/client-response.dto";

import type {
  IClientDetailsProjection,
  IClientProgramDetailsProjection,
} from "../../../types/nutritionist/client/nutriClientDetails.projection";

export class NutriClientDetailsMapper {
  static toClientHealthDetailsDTO(
    projection: IClientDetailsProjection,
  ): ClientHealthDetailsDTO {
    return {
      heightCm: projection.health.heightCm ?? 0,
      weightKg: projection.health.weightKg ?? 0,
      activityLevel: projection.health.activityLevel ?? "",
      dietType: projection.health.dietType ?? "",
      goal: projection.health.goal ?? "",
      targetWeightKg: projection.health.targetWeightKg,
      preferredTimeline: projection.health.preferredTimeline ?? "",
    };
  }

  static toClientProgramSummaryDTO(
    program: IClientProgramDetailsProjection,
  ): ClientProgramSummaryDTO {
    return {
      userProgramId: program.userProgramId.toString(),
      userPlanId: program.userPlanId.toString(),
      nutritionistPlanId: program.planId.toString(),
      planTitle: program.planTitle,
      programStatus: program.programStatus,
      currentDay: program.currentDay,
      durationDays: program.durationDays,
      completionPercentage: program.completionPercentage,
      startDate: program.startDate,
      endDate: program.endDate,
    };
  }

  static toClientDetailsResponseDTO(
    projection: IClientDetailsProjection,
  ): ClientDetailsResponseDTO {
    return {
      clientId: projection.clientId.toString(),
      fullName: projection.fullName,
      email: projection.email,
      phone: projection.phone,
      birthDate: projection.birthDate,
      gender: projection.gender,
      profileImage: projection.profileImage,
      health: this.toClientHealthDetailsDTO(projection),
      programs: projection.programs.map((program) =>
        this.toClientProgramSummaryDTO(program),
      ),
    };
  }
}
