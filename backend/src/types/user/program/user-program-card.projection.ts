import type { ProgramStatus } from "../../../models/userProgram.model";

export interface IUserProgramCardProjection {
  _id: string;
  title: string;
  nutritionist: {
    _id: string;
    fullName: string;
    profileImage?: string;
  };
  programStatus: ProgramStatus;
  currentDay: number;
  durationDays: number;
  completionPercentage: number;
  startDate: Date;
  endDate: Date;
}
