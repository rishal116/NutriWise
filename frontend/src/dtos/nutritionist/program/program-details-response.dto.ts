import { ProgramStatus, SubscriptionStatus } from "./program-card-response.dto";

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

  startDate: string;
  endDate: string;
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
  lastActivityAt?: string;

  programNotes?: string;
}
