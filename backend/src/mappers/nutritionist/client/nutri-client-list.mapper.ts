import {
  ClientListItemDTO,
  ClientProgramSummaryDTO,
} from "../../../dtos/nutritionist/client/client-response.dto";

import {
  IClientListProjection,
  IClientProgramProjection,
} from "../../../types/nutriClientList.projection";

export class NutriClientListMapper {
  static toClientProgramSummaryDTO(
    program: IClientProgramProjection,
  ): ClientProgramSummaryDTO {
    return {
      userProgramId: program.userProgramId.toString(),
      userPlanId: program.userPlanId.toString(),
      nutritionistPlanId: program.planId.toString(),

      planTitle: program.planTitle,

      subscriptionStatus: program.subscriptionStatus,
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
      username: projection.username,
      profileImage: projection.profileImage,

      programs: projection.programs.map((program) =>
        this.toClientProgramSummaryDTO(program),
      ),
    };
  }
}
