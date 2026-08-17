import { Types } from "mongoose";

import { ProgramStatus } from "../models/userProgram.model";
import { SubscriptionStatus } from "../models/userPlan.model";

export interface IClientProgramProjection {
  userProgramId: Types.ObjectId;
  userPlanId: Types.ObjectId;
  planId: Types.ObjectId;

  planTitle: string;

  subscriptionStatus: SubscriptionStatus;
  programStatus: ProgramStatus;

  currentDay: number;
  durationDays: number;
  completionPercentage: number;

  startDate: Date;
  endDate: Date;
}

export interface IClientListProjection {
  clientId: Types.ObjectId;

  fullName: string;
  username: string;
  profileImage?: string;

  programs: IClientProgramProjection[];
}
