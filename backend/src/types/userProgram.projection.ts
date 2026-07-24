import { Types } from "mongoose";

import { ProgramStatus } from "../models/userProgram.model";

export interface IProgramProjection {
  userProgramId: Types.ObjectId;

  userId: Types.ObjectId;

  userPlanId: Types.ObjectId;

  planId: Types.ObjectId;

  fullName: string;

  username: string;

  profileImage?: string;

  planTitle: string;

  status: ProgramStatus;

  currentDay: number;

  durationDays: number;

  completionPercentage: number;

  startDate: Date;

  endDate: Date;
}

export interface ProgramBrowseResult {
  items: IProgramProjection[];

  nextCursor: string | null;

  hasMore: boolean;
}
