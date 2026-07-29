import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { UserProgramCardResponseDTO } from "../../../dtos/user/program/user-program-card-response.dto";
import { UserProgramDetailsResponseDTO } from "../../../dtos/user/program/user-program-details-response.dto";
import { IUserProgramCardProjection } from "../../../types/userProgram.card";
import { IUserProgramDetailsProjection } from "../../../types/user/program/user-program-details.projection";
import { UserProgramBrowseResult } from "../../../types/userProgram.card";

export class ProgramMapper {
  static toCardResponseDTO(
    program: IUserProgramCardProjection,
  ): UserProgramCardResponseDTO {
    return {
      _id: program._id.toString(),
      title: program.title,

      nutritionist: {
        _id: program.nutritionist._id.toString(),
        fullName: program.nutritionist.fullName,
        profileImage: program.nutritionist.profileImage,
      },

      status: program.status,
      currentDay: program.currentDay,
      durationDays: program.durationDays,
      completionPercentage: program.completionPercentage,

      startDate: program.startDate,
      endDate: program.endDate,
    };
  }

  static toBrowseResponseDTO(
    result: UserProgramBrowseResult,
  ): InfiniteScrollResponseDTO<UserProgramCardResponseDTO> {
    return new InfiniteScrollResponseDTO(
      result.items.map(this.toCardResponseDTO),
      result.nextCursor,
      result.hasMore,
    );
  }

  static toDetailsResponseDTO(
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
      currentDay: program.currentDay,
      durationDays: program.durationDays,
      completionPercentage: program.completionPercentage,

      startDate: program.startDate,
      endDate: program.endDate,

      paymentStatus: program.paymentStatus,
      subscriptionStatus: program.subscriptionStatus,
    };
  }
}
