export interface MealResponseDTO {
  id: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  title: string;
  description?: string;
  calories?: number;
  order: number;
}

export interface WorkoutResponseDTO {
  id: string;
  title: string;
  duration: number;
  instructions?: string;
  order: number;
}

export interface HabitResponseDTO {
  id: string;
  title: string;
  targetValue?: number;
  unit?: string;
  order: number;
}

export interface ProgramDaySummaryDTO {
  id: string;

  userProgramId: string;

  dayNumber: number;

  mealCount: number;

  workoutCount: number;

  habitCount: number;

  createdAt: string;

  updatedAt: string;
}

export interface ProgramDayDetailsDTO {
  id: string;

  userProgramId: string;

  dayNumber: number;

  meals: MealResponseDTO[];

  workouts: WorkoutResponseDTO[];

  habits: HabitResponseDTO[];

  createdAt: string;

  updatedAt: string;
}

export interface ProgramDayBrowseResponseDTO {
  items: ProgramDaySummaryDTO[];

  nextCursor: string | null;

  hasMore: boolean;
}