import { TodayTasksResponseDTO, UpdateTodayTasksDTO } from "../../../dtos/user/task.dto";

export interface ITaskService {
  getTodayTasks(userId: string): Promise<TodayTasksResponseDTO>;
  updateTodayTasks(userId: string, payload: UpdateTodayTasksDTO): Promise<void>;
}