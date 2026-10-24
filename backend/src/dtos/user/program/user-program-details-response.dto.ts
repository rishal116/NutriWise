import type { ProgramStatus } from "../../../models/userProgram.model";

export interface IUserProgramDetailsResponseDTO {
  _id: string;
  title: string;
  userPlanId: string;

  nutritionist: {
    _id: string;
    fullName: string;
    username: string;
    profileImage?: string;
  };

  programStatus: ProgramStatus;
  currentDay: number;
  durationDays: number;
  completionPercentage: number;
  startDate: Date;
  endDate: Date;
}