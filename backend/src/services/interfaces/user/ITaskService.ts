import { TaskLogResponseDTO } from "../../../dtos/user/taskLog.dto";

export interface ITaskService {
  updateTodayTasks(userId: string, payload: any): Promise<TaskLogResponseDTO>;
  getTodayTasks(
    userId: string,
    programId: string,
    dayNumber: number,
  ): Promise<TaskLogResponseDTO>;
}
