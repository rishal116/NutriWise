import { ProgramStatus } from "./user-program-request.dto";

export interface UserProgramCardResponseDTO {
  _id: string;
  title: string;
  nutritionist: {
    _id: string;
    fullName: string;
    profileImage?: string;
  };
  status: ProgramStatus;
  currentDay: number;
  durationDays: number;
  completionPercentage: number;
  startDate: string;
  endDate: string;
}