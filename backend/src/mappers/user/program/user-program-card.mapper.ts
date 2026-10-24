import type { IUserProgramCardResponseDTO } from "../../../dtos/user/program/user-program-card-response.dto";

export class UserProgramCardMapper {
  static toResponseDTO(
    program: IUserProgramCardResponseDTO,
  ): IUserProgramCardResponseDTO {
    return {
      _id: program._id,
      title: program.title,
      nutritionist: {
        _id: program.nutritionist._id,
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