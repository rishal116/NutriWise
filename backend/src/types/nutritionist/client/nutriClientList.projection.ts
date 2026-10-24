import { Types } from "mongoose";

import type { ProgramStatus } from "../../../models/userProgram.model";

export interface IClientProgramProjection {
  userProgramId: Types.ObjectId;
  userPlanId: Types.ObjectId;
  planId: Types.ObjectId;
  planTitle: string;
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
  profileImage?: string;
  programs: IClientProgramProjection[];
}