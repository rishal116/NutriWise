import type { IUserProgramCardResponseDTO } from "../../../dtos/user/program/user-program-card-response.dto";
import type { IUserProgramCardProjection } from "../../../types/user/program/user-program-card.projection";

export class UserProgramCardMapper {
  static toResponseDTO(
    program: IUserProgramCardProjection,
  ): IUserProgramCardResponseDTO {
    return {
      id: program._id,
      title: program.title,
      nutritionist: {
        id: program.nutritionist._id,
        fullName: program.nutritionist.fullName,
        profileImage: program.nutritionist.profileImage,
      },
      programStatus: program.programStatus,
      currentDay: program.currentDay,
      durationDays: program.durationDays,
      completionPercentage: program.completionPercentage,
      startDate: program.startDate,
      endDate: program.endDate,
    };
  }
}
