import { ProgramStatus } from "../../../constants/user/program/program-status.constants";

export interface NutriProgramCardResponseDTO {
  userProgramId: string;

  userId: string;
  userFullName: string;
  userProfileImage?: string;

  planTitle: string;
  specialization: string;

  programStatus: ProgramStatus;

  startDate: Date;
  endDate: Date;
  durationDays: number;

  completionPercentage: number;
}
