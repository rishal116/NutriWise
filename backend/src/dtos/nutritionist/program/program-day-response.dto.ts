export class MealResponseDTO {
  id!: string;

  mealType!: string;

  title!: string;

  description?: string;

  calories?: number;

  order!: number;
}

export class WorkoutResponseDTO {
  id!: string;

  title!: string;

  duration!: number;

  instructions?: string;

  order!: number;
}

export class HabitResponseDTO {
  id!: string;

  title!: string;

  targetValue?: number;

  unit?: string;

  order!: number;
}

export class ProgramDaySummaryDTO {
  id!: string;

  userProgramId!: string;

  dayNumber!: number;

  mealCount!: number;

  workoutCount!: number;

  habitCount!: number;

  createdAt!: Date;

  updatedAt!: Date;
}

export class ProgramDayDetailsDTO {
  id!: string;

  userProgramId!: string;

  dayNumber!: number;

  meals!: MealResponseDTO[];

  workouts!: WorkoutResponseDTO[];

  habits!: HabitResponseDTO[];

  createdAt!: Date;

  updatedAt!: Date;
}

export class ProgramDayBrowseResponseDTO {
  items!: ProgramDaySummaryDTO[];

  nextCursor!: string | null;

  hasMore!: boolean;
}