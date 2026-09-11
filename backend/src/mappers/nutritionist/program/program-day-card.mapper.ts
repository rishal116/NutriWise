import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { ProgramDayCardResponseDTO } from "../../../dtos/nutritionist/program/program-day-card-response.dto";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { IProgramDayCardProjection } from "../../../types/nutritionist/program/program-day-card.projection";

export class ProgramDayCardMapper {
  static toProgramDayCardDTO(
    day: IProgramDayCardProjection,
  ): ProgramDayCardResponseDTO {
    return {
      userProgramDayId: day.userProgramDayId,
      userProgramId: day.userProgramId,
      dayNumber: day.dayNumber,
      activityCount: day.activityCount,
    };
  }

  static toInfiniteScrollDTO(
    result: CursorPaginationResult<IProgramDayCardProjection>,
  ): InfiniteScrollResponseDTO<ProgramDayCardResponseDTO> {
    return new InfiniteScrollResponseDTO(
      result.items.map(this.toProgramDayCardDTO),
      result.nextCursor,
      result.hasMore,
    );
  }
}
