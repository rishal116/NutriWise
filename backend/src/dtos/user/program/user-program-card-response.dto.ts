import { ProgramStatus } from "../../../models/userProgram.model";

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

  startDate: Date;
  endDate: Date;
}