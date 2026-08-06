import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { UserProgramCardResponseDTO } from "../../../dtos/nutritionist/program/program-card-response.dto";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { IUserProgramCardProjection } from "../../../types/nutritionist/program/program-card.projection";

export class ProgramCardMapper {
  static toDTO(
    program: IUserProgramCardProjection,
  ): UserProgramCardResponseDTO {
    return {
      userProgramId: program.userProgramId.toString(),

      userId: program.userId.toString(),
      userFullName: program.userFullName,
      userProfileImage: program.userProfileImage,

      planId: program.planId.toString(),
      planTitle: program.planTitle,
      specialization: program.specialization,

      subscriptionStatus: program.subscriptionStatus,
      programStatus: program.programStatus,

      startDate: program.startDate,
      endDate: program.endDate,
      durationDays: program.durationDays,

      completionPercentage: program.completionPercentage,
      adherenceScore: program.adherenceScore,
      currentStreak: program.currentStreak,

      lastActivityAt: program.lastActivityAt,
    };
  }

  static toInfiniteScrollResponse(
    result: CursorPaginationResult<IUserProgramCardProjection>,
  ): InfiniteScrollResponseDTO<UserProgramCardResponseDTO> {
    return new InfiniteScrollResponseDTO(
      result.items.map((item) => this.toDTO(item)),
      result.nextCursor,
      result.hasMore,
    );
  }
}