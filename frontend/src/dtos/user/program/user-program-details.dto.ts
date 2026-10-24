import type { ProgramStatus } from "@/dtos/user/program/user-program-request.dto";

export interface UserProgramDetailsDTO {
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
  startDate: string;
  endDate: string;
}
