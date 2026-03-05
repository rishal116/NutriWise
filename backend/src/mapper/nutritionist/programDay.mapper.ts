import { IProgramDay } from "../../models/programDay.model";
import { ProgramDayResponseDTO } from "../../dtos/nutritionist/programResponse.dto";

export class ProgramDayMapper {
  static toResponseDTO(day: IProgramDay): ProgramDayResponseDTO {
    return {
      id: day._id.toString(),
      userProgramId: day.userProgramId.toString(),
      dayNumber: day.dayNumber,

      meals: day.meals?.map((m) => ({
        mealType: m.mealType,
        title: m.title,
        description: m.description,
        calories: m.calories,
      })),

      workouts: day.workouts?.map((w) => ({
        title: w.title,
        duration: w.duration,
        instructions: w.instructions,
      })),

      habits: day.habits?.map((h) => ({
        title: h.title,
        targetValue: h.targetValue,
        unit: h.unit,
      })),

      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
    };
  }

  static toResponseDTOList(
    days: IProgramDay[]
  ): ProgramDayResponseDTO[] {
    return days.map((d) => this.toResponseDTO(d));
  }
}