import { Types } from "mongoose";

export interface UserTaskProgressDTO {
  id: string;

  userId: string;
  challengeId: string;
  taskId: string;

  dayNumber: number;

  completed: boolean;
  skipped: boolean;

  actualValue?: number;
  completionPercentage: number;

  completedAt?: string;
  skippedAt?: string;

  timeSpent?: number;

  mood?: "excellent" | "good" | "average" | "bad";

  caloriesBurned?: number;

  notes?: string;

  streakContribution: boolean;

  createdAt: string;
  updatedAt: string;
}