import {
  ProgramStatus,
  SubscriptionStatus,
} from "@/dtos/user/program/user-program-request.dto";

export interface UserProgramCardDTO {
  _id: string;
  title: string;
  nutritionist: {
    _id: string;
    fullName: string;
    profileImage?: string;
  };
  programStatus: ProgramStatus;
  subscriptionStatus: SubscriptionStatus;
  currentDay: number;
  durationDays: number;
  completionPercentage: number;
  startDate: string;
  endDate: string;
}
