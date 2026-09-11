import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { UserProgramCardResponseDTO } from "../../../dtos/user/program/user-program-card-response.dto";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export class UserProgramCardMapper {
  static toResponseDTO(
    program: UserProgramCardResponseDTO,
  ): UserProgramCardResponseDTO {
    return {
      _id: program._id,
      title: program.title,
      nutritionist: {
        _id: program.nutritionist._id,
        fullName: program.nutritionist.fullName,
        profileImage: program.nutritionist.profileImage,
      },
      programStatus: program.programStatus,
      subscriptionStatus: program.subscriptionStatus,
      currentDay: program.currentDay,
      durationDays: program.durationDays,
      completionPercentage: program.completionPercentage,
      startDate: program.startDate,
      endDate: program.endDate,
    };
  }

  static toBrowseResponseDTO(
    result: CursorPaginationResult<UserProgramCardResponseDTO>,
  ): InfiniteScrollResponseDTO<UserProgramCardResponseDTO> {
    return new InfiniteScrollResponseDTO(
      result.items.map(this.toResponseDTO),
      result.nextCursor,
      result.hasMore,
    );
  }
}
