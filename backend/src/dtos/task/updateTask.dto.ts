import { CreateTaskDTO } from "./createTask.dto";

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  isDeleted?: boolean;
  deletedAt?: Date | null;
}

