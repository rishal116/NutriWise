import type { ProgramStatus } from "@/constants/user/program/program-status.constants";

export interface UserProgramCardResponseDTO {
  id: string;
  title: string;
  nutritionist: {
    id: string;
    fullName: string;
    profileImage?: string;
  };
  programStatus: ProgramStatus;
  currentDay: number;
  durationDays: number;
  completionPercentage: number;
  startDate: string | null;
  endDate: string | null;
}
