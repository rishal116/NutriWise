import { UserDayTrackingStatus } from "../../../models/userDayTracking.model";

export interface UserDayTrackingDetailsDTO {
  _id: string;
  userId: string;
  userProgramId: string;
  userProgramDayId: string;
  dayNumber: number;
  date: Date;
  status: UserDayTrackingStatus;
  startedAt?: Date | null;
  completedAt?: Date | null;
  lastActivityAt?: Date | null;
  totalActivities: number;
  completedActivities: number;
  skippedActivities: number;
  overallCompletionPercentage: number;
  adherenceScore: number;
  isLocked: boolean;
  userNotes?: string;
  nutritionistNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}