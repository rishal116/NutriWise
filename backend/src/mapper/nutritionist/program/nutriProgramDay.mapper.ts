import {
  HabitResponseDTO,
  MealResponseDTO,
  ProgramDayBrowseResponseDTO,
  ProgramDayDetailsDTO,
  ProgramDaySummaryDTO,
  WorkoutResponseDTO,
} from "../../../dtos/nutritionist/program/program-day-response.dto";

import {
  IProgramDayProjection,
  ProgramDayBrowseResult,
} from "../../../types/userProgramDay.projection";

export class NutriProgramDayMapper {
  static toProgramDayBrowseResponseDTO(
    result: ProgramDayBrowseResult,
  ): ProgramDayBrowseResponseDTO {
    return {
      items: result.items.map((day) => this.toProgramDaySummaryDTO(day)),
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
    };
  }

  static toProgramDaySummaryDTO(
    day: IProgramDayProjection,
  ): ProgramDaySummaryDTO {
    return {
      id: day.userProgramDayId.toString(),
      userProgramId: day.userProgramId.toString(),
      dayNumber: day.dayNumber,

      mealCount: day.meals.length,
      workoutCount: day.workouts.length,
      habitCount: day.habits.length,

      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
    };
  }
  static toProgramDayDetailsDTO(
    day: IProgramDayProjection,
  ): ProgramDayDetailsDTO {
    return {
      id: day.userProgramDayId.toString(),
      userProgramId: day.userProgramId.toString(),
      dayNumber: day.dayNumber,

      meals: day.meals.map(
        (meal): MealResponseDTO => ({
          id: meal._id.toString(),
          mealType: meal.mealType,
          title: meal.title,
          description: meal.description,
          calories: meal.calories,
          order: meal.order,
        }),
      ),

      workouts: day.workouts.map(
        (workout): WorkoutResponseDTO => ({
          id: workout._id.toString(),
          title: workout.title,
          duration: workout.duration,
          instructions: workout.instructions,
          order: workout.order,
        }),
      ),

      habits: day.habits.map(
        (habit): HabitResponseDTO => ({
          id: habit._id.toString(),
          title: habit.title,
          targetValue: habit.targetValue,
          unit: habit.unit,
          order: habit.order,
        }),
      ),

      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
    };
  }
}
