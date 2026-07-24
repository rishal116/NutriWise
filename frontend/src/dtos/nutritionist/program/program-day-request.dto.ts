export interface MealDTO {
  mealType: "breakfast" | "lunch" | "dinner" | "snack";

  title: string;

  description?: string;

  calories?: number;

  order: number;
}

export interface WorkoutDTO {
  title: string;

  duration: number;

  instructions?: string;

  order: number;
}

export interface HabitDTO {
  title: string;

  targetValue?: number;

  unit?: string;

  order: number;
}

export interface CreateProgramDayDTO {
  dayNumber: number;

  meals?: MealDTO[];

  workouts?: WorkoutDTO[];

  habits?: HabitDTO[];
}

export interface UpdateProgramDayDTO {
  meals?: MealDTO[];

  workouts?: WorkoutDTO[];

  habits?: HabitDTO[];
}