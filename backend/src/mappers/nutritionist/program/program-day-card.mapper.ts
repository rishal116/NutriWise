import type { INutriProgramDayCardResponseDTO } from "../../../dtos/nutritionist/program/nutri-program-day-card-response.dto";
import type { INutriProgramDayCardProjection } from "../../../types/nutritionist/program/nutri-program-day-card.projection";

export class NutriProgramDayCardMapper {
  static toProgramDayCardDTO(
    day: INutriProgramDayCardProjection,
  ): INutriProgramDayCardResponseDTO {
    return {
      userProgramDayId: day.userProgramDayId,
      userProgramId: day.userProgramId,
      dayNumber: day.dayNumber,
      activityCount: day.activityCount,
    };
  }
}
