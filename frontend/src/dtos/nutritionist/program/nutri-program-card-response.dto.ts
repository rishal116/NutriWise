import type { ProgramStatus } from "@/types/program.types";

export interface NutriProgramCardResponseDTO {
  userProgramId: string;
  userId: string;
  userFullName: string;
  userProfileImage?: string;

  planTitle: string;
  specialization: string;
  programStatus: ProgramStatus;

  startDate: string;
  endDate: string;
  durationDays: number;
  completionPercentage: number;
}