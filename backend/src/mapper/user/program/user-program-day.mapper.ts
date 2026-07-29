import {
  IUserProgramDayDetailsProjection,
  IUserProgramDayListProjection,
} from "../../../types/user/program/user-program-day.projection";
import { UserProgramDayDetailsResponseDTO } from "../../../dtos/user/program/user-program-day-details-response.dto";
import { UserProgramDayResponseDTO } from "../../../dtos/user/program/user-program-day-response.dto";

export class UserProgramDayMapper {
  static toResponseDTO(
    day: IUserProgramDayListProjection,
  ): UserProgramDayResponseDTO {
    return {
      _id: day._id.toString(),
      dayNumber: day.dayNumber,
      mealCount: day.mealCount,
      workoutCount: day.workoutCount,
      habitCount: day.habitCount,
    };
  }

  static toResponseDTOList(
    days: IUserProgramDayListProjection[],
  ): UserProgramDayResponseDTO[] {
    return days.map((day) => this.toResponseDTO(day));
  }

  static toDetailsResponseDTO(
    day: IUserProgramDayDetailsProjection,
  ): UserProgramDayDetailsResponseDTO {
    return {
      _id: day._id.toString(),
      dayNumber: day.dayNumber,

      meals: day.meals.map((meal) => ({
        _id: meal._id.toString(),
        mealType: meal.mealType,
        title: meal.title,
        description: meal.description,
        calories: meal.calories,
        order: meal.order,
      })),

      workouts: day.workouts.map((workout) => ({
        _id: workout._id.toString(),
        title: workout.title,
        duration: workout.duration,
        instructions: workout.instructions,
        order: workout.order,
      })),

      habits: day.habits.map((habit) => ({
        _id: habit._id.toString(),
        title: habit.title,
        targetValue: habit.targetValue,
        unit: habit.unit,
        order: habit.order,
      })),
    };
  }
}
