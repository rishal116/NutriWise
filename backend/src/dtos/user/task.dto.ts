export interface TodayTasksResponseDTO {
  program: any;
  programDay: any;
  taskLog: any;
}

export interface UpdateTodayTasksDTO {
  mealsCompleted?: string[];
  workoutsCompleted?: string[];
  habitsProgress?: {
    title: string;
    value: number;
  }[];
  weight?: number;
  waterIntake?: number;
  sleepHours?: number;
  notes?: string;
}