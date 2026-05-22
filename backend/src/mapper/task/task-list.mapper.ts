import { ITask } from "../../models/task.model";
import { TaskListDTO } from "../../dtos/task/taskList.dto";

export const mapTaskToListDTO = (task: ITask): TaskListDTO => ({
  id: task._id.toString(),
  challengeId: task.challengeId.toString(),
  dayNumber: task.dayNumber,
  order: task.order,
  title: task.title,
  slug: task.slug,
  type: task.type,
  status: task.status,
  category: task.category,
  difficulty: task.difficulty,
  shortDescription: task.shortDescription,
  coverImage: task.coverImage,
  estimatedDurationMinutes: task.estimatedDurationMinutes,
  isOptional: task.isOptional,
  isLocked: task.isLocked,
  completionCount: task.completionCount,
  averageCompletionRate: task.averageCompletionRate,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

