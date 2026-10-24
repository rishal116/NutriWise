import { NutriProgramCardResponseDTO } from "../../../dtos/nutritionist/program/nutri-program-card-response.dto";
import { INutriProgramCardProjection } from "../../../types/nutritionist/program/nutri-program-card.projection";

export class NutriProgramCardMapper {
  static toDTO(
    program: INutriProgramCardProjection,
  ): NutriProgramCardResponseDTO {
    return {
      userProgramId: program.userProgramId.toString(),

      userId: program.userId.toString(),
      userFullName: program.userFullName,
      userProfileImage: program.userProfileImage,

      planTitle: program.planTitle,
      specialization: program.specialization,

      programStatus: program.programStatus,

      startDate: program.startDate,
      endDate: program.endDate,
      durationDays: program.durationDays,

      completionPercentage: program.completionPercentage,
    };
  }
}
