import { IUserTaskProgress } from "../../models/userTaskProgress.model";
import { UserTaskProgressDTO } from "../../dtos/user/user-task-progress.dto";

export function mapUserTaskProgressToDTO(
  doc: IUserTaskProgress,
): UserTaskProgressDTO {
  return {
    id: doc._id.toString(),

    userId: doc.userId.toString(),
    challengeId: doc.challengeId.toString(),
    taskId: doc.taskId.toString(),

    dayNumber: doc.dayNumber,

    completed: doc.completed,
    skipped: doc.skipped,

    actualValue: doc.actualValue,

    completionPercentage: doc.completionPercentage,

    completedAt: doc.completedAt
      ? doc.completedAt.toISOString()
      : undefined,

    skippedAt: doc.skippedAt
      ? doc.skippedAt.toISOString()
      : undefined,

    timeSpent: doc.timeSpent,



    mood: doc.mood,
    caloriesBurned: doc.caloriesBurned,
    notes: doc.notes,

    streakContribution: doc.streakContribution,

    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}