import type { ProgramStatus } from "@/types/program.types";

export interface NutriProgramDetailsResponseDTO {
  userProgramId: string;
  userId: string;
  userFullName: string;
  userProfileImage?: string;

  planTitle: string;
  planDescription?: string;
  specialization: string;
  programStatus: ProgramStatus;

  startDate: string;
  endDate: string;
  durationDays: number;
  completionPercentage: number;

  completedDays: number;
  totalDays: number;

  completedActivities: number;
  totalActivities: number;
  skippedActivities: number;

  currentStreak: number;
  longestStreak: number;
  lastActivityAt?: string;
}