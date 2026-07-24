import { Types } from "mongoose";
import { ProgramStatus } from "../models/userProgram.model";
import { SubscriptionStatus } from "../models/userPlan.model";

export interface IClientListProjection {
  clientId: Types.ObjectId;

  userProgramId: Types.ObjectId;

  userPlanId: Types.ObjectId;

  planId: Types.ObjectId;

  fullName: string;

  username: string;

  profileImage?: string;

  planTitle: string;

  subscriptionStatus: SubscriptionStatus;

  programStatus: ProgramStatus;

  currentDay: number;

  durationDays: number;

  completionPercentage: number;

  startDate: Date;

  endDate: Date;
}

export interface ClientCursor {
  value: number | string;
  id: string;
}

export interface ClientBrowseResult {
  items: IClientListProjection[];

  nextCursor: string | null;

  hasMore: boolean;
}