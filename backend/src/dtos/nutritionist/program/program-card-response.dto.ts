import { ProgramStatus } from "../../../models/userProgram.model";
import { SubscriptionStatus } from "../../../models/userPlan.model";

export interface UserProgramCardResponseDTO {
  userProgramId: string;

  userId: string;
  userFullName: string;
  userProfileImage?: string;

  planId: string;
  planTitle: string;
  specialization: string;

  subscriptionStatus: SubscriptionStatus;
  programStatus: ProgramStatus;

  startDate: Date;
  endDate: Date;
  durationDays: number;

  currentDay: number;

  completionPercentage: number;
  adherenceScore: number;
  currentStreak: number;

  lastActivityAt?: Date;
}
