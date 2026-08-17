import { ProgramDayResponseDTO } from "../../../dtos/nutritionist/program/program-day-response.dto";
import { IProgramDayProjection } from "../../../types/nutritionist/program/program-day.projection";

export class ProgramDayMapper {
  static toProgramDayDTO(day: IProgramDayProjection): ProgramDayResponseDTO {
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
        configuration: activity.configuration,
        order: activity.order,
      })),

      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
    };
  }
}
