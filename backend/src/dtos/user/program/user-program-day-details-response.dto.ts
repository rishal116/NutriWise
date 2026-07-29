import { MealType } from "../../../models/userProgramDay.model";

export interface UserProgramMealResponseDTO {
  _id: string;
  mealType: MealType;
  title: string;
  description?: string;
  calories?: number;
  order: number;
}

export interface UserProgramWorkoutResponseDTO {
  _id: string;
  title: string;
  duration: number;
  instructions?: string;
  order: number;
}

export interface UserProgramHabitResponseDTO {
  _id: string;
  title: string;
  targetValue?: number;
  unit?: string;
  order: number;
}

export interface UserProgramDayDetailsResponseDTO {
  _id: string;
  dayNumber: number;
  meals: UserProgramMealResponseDTO[];
  workouts: UserProgramWorkoutResponseDTO[];
  habits: UserProgramHabitResponseDTO[];
}