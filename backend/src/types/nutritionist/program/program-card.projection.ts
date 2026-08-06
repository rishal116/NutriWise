import { Types } from "mongoose";
import { SubscriptionStatus } from "../../../models/userPlan.model";
import { ProgramStatus } from "../../../models/userProgram.model";

export interface IUserProgramCardProjection {
  userProgramId: Types.ObjectId;

  userId: Types.ObjectId;
  userFullName: string;
  userProfileImage?: string;

  planId: Types.ObjectId;
  planTitle: string;
  specialization: string;

  subscriptionStatus: SubscriptionStatus;
  programStatus: ProgramStatus;

  startDate: Date;
  endDate: Date;
  durationDays: number;

  completionPercentage: number;
  adherenceScore: number;
  currentStreak: number;

  lastActivityAt?: Date;
}
