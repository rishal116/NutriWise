import type { NutriProgramDayCardResponseDTO } from "../../../dtos/nutritionist/program-day/nutri-program-day-card-response.dto";
import type { INutriProgramDayCardProjection } from "../../../types/nutritionist/program/nutri-program-day-card.projection";

export class NutriProgramDayCardMapper {
  static toProgramDayCardDTO(
    day: INutriProgramDayCardProjection,
  ): NutriProgramDayCardResponseDTO {
    return {
      userProgramDayId: day.userProgramDayId,
      userProgramId: day.userProgramId,
      dayNumber: day.dayNumber,
      totalActivityCount: day.totalActivityCount,
      totalRequiredActivityCount: day.totalRequiredActivityCount,
    };
  }
}
