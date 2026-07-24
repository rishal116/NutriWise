import {
  ProgramBrowseResult,
  IProgramProjection,
} from "../../../types/userProgram.projection";

import {
  ProgramBrowseResponseDTO,
  ProgramDetailsDTO,
  ProgramSummaryDTO,
} from "../../../dtos/nutritionist/program/program-response.dto";

export class NutriProgramMapper {
  static toProgramSummaryDTO(program: IProgramProjection): ProgramSummaryDTO {
    return {
      userProgramId: program.userProgramId.toString(),
      userId: program.userId.toString(),
      userPlanId: program.userPlanId.toString(),
      planId: program.planId.toString(),

      fullName: program.fullName,
      username: program.username,
      profileImage: program.profileImage,

      planTitle: program.planTitle,

      status: program.status,

      currentDay: program.currentDay,
      durationDays: program.durationDays,
      completionPercentage: program.completionPercentage,

      startDate: program.startDate,
      endDate: program.endDate,
    };
  }

  static toProgramBrowseResponseDTO(
    result: ProgramBrowseResult,
  ): ProgramBrowseResponseDTO {
    return {
      items: result.items.map((program) => this.toProgramSummaryDTO(program)),
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
    };
  }

  static toProgramDetailsDTO(program: IProgramProjection): ProgramDetailsDTO {
    return {
      ...this.toProgramSummaryDTO(program),
    };
  }
}
