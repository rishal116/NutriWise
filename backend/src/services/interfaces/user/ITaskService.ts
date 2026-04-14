import { TaskLogResponseDTO, UpdateTodayTasksPayload } from "../../../dtos/user/taskLog.dto";

export interface ITaskService {
  updateTodayTasks(userId: string,payload:UpdateTodayTasksPayload  ): Promise<TaskLogResponseDTO>;
  getTodayTasks(
    userId: string,
    programId: string,
    dayNumber: number,
  ): Promise<TaskLogResponseDTO>;
}
