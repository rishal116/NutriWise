import { DayTrackingStatus } from "../../../constants/user/program/day-tracking-status.constants";


export interface UserDayTrackingDetailsDTO {
  _id: string;
  userId: string;
  userProgramId: string;
  userProgramDayId: string;
  dayNumber: number;
  date: Date;
  status: DayTrackingStatus;
  startedAt: Date | null;
  completedAt: Date | null;
  lastActivityAt: Date | null;
  totalActivities: number;
  completedActivities: number;
  skippedActivities: number;
  isLocked: boolean;
  userNotes?: string;
  nutritionistNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}
