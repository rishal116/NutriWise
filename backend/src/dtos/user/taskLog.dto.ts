export interface TaskLogResponseDTO {
  id: string;
  userProgramId: string;
  programDayId: string;
  date: string;

  meals?: {
    _id?: string;
    mealType: string;
    title: string;
    description?: string;
    calories?: number;
    order?: number;
    completed: boolean;
  }[];

  workouts?: {
    _id?: string;
    title: string;
    duration: number;
    instructions?: string;
    order?: number;
    completed: boolean;
  }[];

  habits?: {
    _id?: string;
    title: string;
    targetValue?: number;
    unit?: string;
    order?: number;
    value: number;
  }[];
}