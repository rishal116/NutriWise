import type { INutriProgramDayResponseDTO } from "../../../dtos/nutritionist/program/nutri-program-day-response.dto";
import type { INutriProgramDayProjection } from "../../../types/nutritionist/program/nutri-program-day.projection";

export class NutriProgramDayMapper {
  static toProgramDayDTO(
    day: INutriProgramDayProjection,
  ): INutriProgramDayResponseDTO {
    return {
      userProgramDayId: day._id,
      userProgramId: day.userProgramId,
      dayNumber: day.dayNumber,
      activities: day.activities.map((activity) => ({
        _id: activity._id,
        category: activity.category,
        title: activity.title,
        description: activity.description,
        instructions: activity.instructions,
        valueType: activity.valueType,
        targetValue: activity.targetValue,
        unit: activity.unit,
        estimatedDurationMinutes: activity.estimatedDurationMinutes,
        scheduledTime: activity.scheduledTime,
        isRequired: activity.isRequired,
        order: activity.order,
      })),
    };
  }
}
