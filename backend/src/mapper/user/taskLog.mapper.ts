import { ITaskLog } from "../../models/taskLog.model";
import { IProgramDay } from "../../models/programDay.model";
import { TaskLogResponseDTO } from "../../dtos/user/taskLog.dto";

export class TaskLogMapper {
  static toResponseDTO(taskLog: ITaskLog, programDay: IProgramDay): TaskLogResponseDTO {
    if (!programDay) {
      throw new Error("ProgramDay is required to map full task details.");
    }

    return {
      id: taskLog._id.toString(),
      userProgramId: taskLog.userProgramId.toString(),
      programDayId: taskLog.programDayId.toString(),
      date: taskLog.date.toISOString(),

      // Map meals from programDay and merge completion status
      meals: (programDay.meals || []).map((meal) => ({
        _id: meal._id?.toString(),
        mealType: meal.mealType,
        title: meal.title,
        description: meal.description,
        calories: meal.calories,
        order: meal.order,
        completed: taskLog.mealsCompleted?.some(
          (m) => m.mealId.toString() === meal._id?.toString()
        ) || false,
      })),

      workouts: (programDay.workouts || []).map((workout) => ({
        _id: workout._id?.toString(),
        title: workout.title,
        duration: workout.duration,
        instructions: workout.instructions,
        order: workout.order,
        completed: taskLog.workoutsCompleted?.some(
          (w) => w.workoutId.toString() === workout._id?.toString()
        ) || false,
      })),

      habits: (programDay.habits || []).map((habit) => {
        const progress = taskLog.habitsProgress?.find(
          (h) => h.habitId.toString() === habit._id?.toString()
        );
        return {
          _id: habit._id?.toString(),
          title: habit.title,
          targetValue: habit.targetValue,
          unit: habit.unit,
          order: habit.order,
          value: progress?.value || 0,
        };
      }),
    };
  }
}