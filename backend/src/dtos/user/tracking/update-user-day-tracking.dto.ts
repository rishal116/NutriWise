import { DayTrackingStatus } from "../../../constants/user/program/day-tracking-status.constants";


export interface UpdateUserDayTrackingDTO {
  status?: DayTrackingStatus;
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