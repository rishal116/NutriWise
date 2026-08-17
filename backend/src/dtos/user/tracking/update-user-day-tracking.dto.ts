import { UserDayTrackingStatus } from "../../../models/userDayTracking.model";

export interface UpdateUserDayTrackingDTO {
  status?: UserDayTrackingStatus;
  startedAt?: Date | null;
  completedAt?: Date | null;
  lastActivityAt?: Date | null;
  totalActivities?: number;
  completedActivities?: number;
  skippedActivities?: number;
  overallCompletionPercentage?: number;
  adherenceScore?: number;
  isLocked?: boolean;
  userNotes?: string;
  nutritionistNotes?: string;
}