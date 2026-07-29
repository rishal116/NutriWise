import { Types } from "mongoose";
import { ProgramStatus } from "../../../models/userProgram.model";
import { PaymentStatus } from "../../../models/userPlan.model";
import { SubscriptionStatus } from "../../../models/userPlan.model";

export interface IUserProgramDetailsProjection {
  _id: Types.ObjectId;

  title: string;

  nutritionist: {
    _id: Types.ObjectId;
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

  // Optional but useful
  purchasedAt: Date;
}
