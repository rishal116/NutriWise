import type {
  ClientListItemDTO,
  ClientProgramSummaryDTO,
} from "../../../dtos/nutritionist/client/client-response.dto";

import type {
  IClientListProjection,
  IClientProgramProjection,
} from "../../../types/nutritionist/client/nutriClientList.projection";

export class NutriClientListMapper {
  static toClientProgramSummaryDTO(
    program: IClientProgramProjection,
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

  static toClientListItemDTO(
    projection: IClientListProjection,
  ): ClientListItemDTO {
    return {
      clientId: projection.clientId.toString(),
      fullName: projection.fullName,
      profileImage: projection.profileImage,

      programs: projection.programs.map((program) =>
        this.toClientProgramSummaryDTO(program),
      ),
    };
  }
}
