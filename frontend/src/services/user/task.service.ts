import { api } from "@/lib/axios/api";

export interface MealDTO {
  _id: string;
  mealType: string;
  title: string;
  description?: string;
  calories?: number;
  order?: number;
  completed: boolean;
}

export interface WorkoutDTO {
  _id: string;
  title: string;
  duration?: number;
  instructions?: string;
  order?: number;
  completed: boolean;
}

export interface HabitDTO {
  _id: string;
  title: string;
  targetValue?: number;
  unit?: string;
  order?: number;
  value: number;
}

export interface TaskLogDTO {
  id: string;
  userProgramId: string;
  programDayId: string;
  date: string;
  meals: MealDTO[];
  workouts: WorkoutDTO[];
  habits: HabitDTO[];
}

export const taskService = {
  async getTodayLog(programId: string, dayNumber: number): Promise<TaskLogDTO> {
    const res = await api.get("/tasks/today", { params: { programId, dayNumber } });
    return res.data.data; // <-- use .data here
  },

  async updateTodayTasks(payload: {
  programId: string;
  dayNumber: number;
  type: string;
  value: string;
  title?: string;
}): Promise<TaskLogDTO> {
    const res = await api.post("/tasks/today", payload);
    return res.data.data; // <-- use .data here
  },
};