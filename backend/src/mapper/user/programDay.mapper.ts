import { IProgramDay } from "../../models/programDay.model";
import { ProgramDayResponseDTO } from "../../dtos/user/userProgram.dto"
import { Types } from "mongoose";

export class ProgramDayMapper {
  static toResponseDTO(day: IProgramDay): ProgramDayResponseDTO {
    return {
      id: day._id.toString(),
      userProgramId: day.userProgramId.toString(),
      dayNumber: day.dayNumber,

      meals: day.meals?.map((m) => ({
        _id: m._id?.toString() || new Types.ObjectId().toString(),
        mealType: m.mealType,
        title: m.title,
        description: m.description,
        calories: m.calories,
      })),

      workouts: day.workouts?.map((w) => ({
        _id: w._id?.toString() || new Types.ObjectId().toString(),
        title: w.title,
        duration: w.duration,
        instructions: w.instructions,
      })),

      habits: day.habits?.map((h) => ({
        _id: h._id?.toString() || new Types.ObjectId().toString(),
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