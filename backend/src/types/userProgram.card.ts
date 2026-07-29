import { Types } from "mongoose";
import { ProgramStatus } from "../models/userProgram.model";
import { SubscriptionStatus } from "../models/userPlan.model";

export interface IUserProgramCardProjection {
  _id: Types.ObjectId;
  title: string;
  nutritionist: {
    _id: Types.ObjectId;
    fullName: string;
    profileImage?: string;
  };
  subscriptionStatus: SubscriptionStatus;
  status: ProgramStatus;
  currentDay: number;
  durationDays: number;
  completionPercentage: number;
  startDate: Date;
  endDate: Date;
}

export interface UserProgramBrowseResult {
  items: IUserProgramCardProjection[];
  nextCursor: string | null;
  hasMore: boolean;
}
