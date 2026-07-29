import { PaymentStatus, SubscriptionStatus } from "../../../models/userPlan.model";
import { ProgramStatus } from "../../../models/userProgram.model";

export interface UserProgramDetailsResponseDTO {
  _id: string;

  title: string;

  nutritionist: {
    _id: string;
    fullName: string;
    username: string;
    profileImage?: string;
  };

  status: ProgramStatus;

  currentDay: number;
  durationDays: number;
  completionPercentage: number;

  startDate: Date;
  endDate: Date;

  paymentStatus: PaymentStatus;
  subscriptionStatus: SubscriptionStatus;
}