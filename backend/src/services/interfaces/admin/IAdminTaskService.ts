import { CreateTaskDTO } from "../../../dtos/task/createTask.dto";
import { UpdateTaskDTO } from "../../../dtos/task/updateTask.dto";
import { TaskResponseDTO } from "../../../dtos/task/taskResponse.dto";
import { TaskListDTO } from "../../../dtos/task/taskList.dto";
import { ITask } from "../../../models/task.model";

export interface IAdminTaskService {
  createTask(
    challengeId: string,
    dto: CreateTaskDTO,
    files?: {
      coverImage?: Express.Multer.File[];
      mediaFiles?: Express.Multer.File[];
      instructionMediaFiles?: Express.Multer.File[];
    },
  ): Promise<ITask>;

  getTasksByChallenge(challengeId: string): Promise<TaskListDTO[]>;

  getTaskById(taskId: string): Promise<TaskResponseDTO>;

  updateTask(
    taskId: string,
    dto: UpdateTaskDTO,
    files?: {
      coverImage?: Express.Multer.File[];
      mediaFiles?: Express.Multer.File[];
      instructionMediaFiles?: Express.Multer.File[];
    },
  ): Promise<TaskResponseDTO>;

  deleteTask(taskId: string): Promise<void>;
}