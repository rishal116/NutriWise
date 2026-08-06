import { ProgramStatus } from "../../../models/userProgram.model";
import { SubscriptionStatus } from "../../../models/userPlan.model";

export interface UserProgramCardResponseDTO {
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
  startDate: Date;
  endDate: Date;
}
