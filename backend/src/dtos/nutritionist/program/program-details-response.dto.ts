import { ProgramStatus } from "../../../models/userProgram.model";
import { SubscriptionStatus } from "../../../models/userPlan.model";

export interface UserProgramDetailsResponseDTO {
  userProgramId: string;

  userId: string;
  userFullName: string;
  userProfileImage?: string;

  planId: string;
  planTitle: string;
  planDescription?: string;
  specialization: string;

  subscriptionStatus: SubscriptionStatus;
  paymentStatus: string;

  programStatus: ProgramStatus;

  startDate: Date;
  endDate: Date;
  durationDays: number;

  currentDay: number;

  completionPercentage: number;
  adherenceScore: number;

  completedDays: number;
  totalDays: number;

  completedActivities: number;
  totalActivities: number;
  skippedActivities: number;

  currentStreak: number;
  longestStreak: number;

  lastCompletedDay: number;
  lastActivityAt?: Date;

  programNotes?: string;
}
