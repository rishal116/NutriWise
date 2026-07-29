export interface UserProgramMealDTO {
  _id: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  title: string;
  description?: string;
  calories?: number;
  order: number;
}

export interface UserProgramWorkoutDTO {
  _id: string;
  title: string;
  duration: number;
  instructions?: string;
  order: number;
}

export interface UserProgramHabitDTO {
  _id: string;
  title: string;
  targetValue?: number;
  unit?: string;
  order: number;
}

export interface UserProgramDayDetailsDTO {
  _id: string;
  dayNumber: number;

  meals: UserProgramMealDTO[];
  workouts: UserProgramWorkoutDTO[];
  habits: UserProgramHabitDTO[];
}