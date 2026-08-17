export const SUBSCRIPTION_STATUS = [
  "pending",
  "active",
  "expired",
  "cancelled",
] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[number];

export const PROGRAM_STATUS = [
  "upcoming",
  "active",
  "paused",
  "completed",
  "cancelled",
] as const;

export type ProgramStatus = (typeof PROGRAM_STATUS)[number];

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

  startDate: string;
  endDate: string;
  durationDays: number;

  currentDay: number;

  completionPercentage: number;
  adherenceScore: number;
  currentStreak: number;

  lastActivityAt?: string;
}
