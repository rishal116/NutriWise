import { UserProgramDetailsResponseDTO } from "../../../dtos/user/program/user-program-details-response.dto";
import { IUserProgramDetailsProjection } from "../../../types/user/program/user-program-details.projection";

export class UserProgramDetailsMapper {
  static toResponseDTO(
    program: IUserProgramDetailsProjection,
  ): UserProgramDetailsResponseDTO {
    return {
      _id: program._id.toString(),
      title: program.title,

      nutritionist: {
        _id: program.nutritionist._id.toString(),
        fullName: program.nutritionist.fullName,
        username: program.nutritionist.username,
        profileImage: program.nutritionist.profileImage,
      },

      status: program.status,
      subscriptionStatus: program.subscriptionStatus,

      currentDay: program.currentDay,
      durationDays: program.durationDays,
      completionPercentage: program.completionPercentage,

      startDate: program.startDate,
      endDate: program.endDate,

      paymentStatus: program.paymentStatus,
    };
  }
}