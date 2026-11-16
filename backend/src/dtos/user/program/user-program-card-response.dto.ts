import type { ProgramStatus } from "../../../constants/user/program/program-status.constants";

export interface IUserProgramCardResponseDTO {
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
  startDate: Date | null;
  endDate: Date | null;
}
