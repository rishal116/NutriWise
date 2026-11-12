import { ProgramStatus } from "../../../constants/user/program/program-status.constants";


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