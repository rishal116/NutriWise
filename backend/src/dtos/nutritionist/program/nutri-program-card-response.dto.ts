import type { ProgramStatus } from "../../../constants/user/program/program-status.constants";

export interface NutriProgramCardResponseDTO {
  userProgramId: string;

  userId: string;
  userFullName: string;
  userProfileImage?: string;

  planTitle: string;
  specialization: string;

  programStatus: ProgramStatus;

  currentDay: number;
  durationDays: number;
  completionPercentage: number;

  startDate: Date | null;
  endDate: Date | null;
}
