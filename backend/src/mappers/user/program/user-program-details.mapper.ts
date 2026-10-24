import type { IUserProgramDetailsResponseDTO } from "../../../dtos/user/program/user-program-details-response.dto";
import type { IUserProgramDetailsProjection } from "../../../types/user/program/user-program-details.projection";

export class UserProgramDetailsMapper {
  static toResponseDTO(
    program: IUserProgramDetailsProjection,
  ): IUserProgramDetailsResponseDTO {
    return {
      _id: program._id.toString(),
      title: program.title,
      userPlanId: program.userPlanId.toString(),
      nutritionist: {
        _id: program.nutritionist._id.toString(),
        fullName: program.nutritionist.fullName,
        username: program.nutritionist.username,
        profileImage: program.nutritionist.profileImage,
      },
      programStatus: program.status,
      currentDay: program.currentDay,
      durationDays: program.durationDays,
      completionPercentage: program.completionPercentage,
      startDate: program.startDate,
      endDate: program.endDate,
    };
  }
}
