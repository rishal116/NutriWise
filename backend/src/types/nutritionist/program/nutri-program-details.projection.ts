import { Types } from "mongoose";
import { ProgramStatus } from "../../../models/userProgram.model";

export interface INutriProgramDetailsProjection {
  userProgramId: Types.ObjectId;

  userId: Types.ObjectId;
  userFullName: string;
  userProfileImage?: string;

  planTitle: string;
  planDescription?: string;
  specialization: string;

  programStatus: ProgramStatus;
  startDate: Date;
  endDate: Date;
  durationDays: number;

  completionPercentage: number;
  completedDays: number;
  totalDays: number;

  completedActivities: number;
  totalActivities: number;
  skippedActivities: number;

  currentStreak: number;
  longestStreak: number;
  lastActivityAt?: Date;
}