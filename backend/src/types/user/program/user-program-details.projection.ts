import { Types } from "mongoose";

import type { ProgramStatus } from "../../../models/userProgram.model";

export interface IUserProgramDetailsProjection {
  _id: Types.ObjectId;
  title: string;
  userPlanId: Types.ObjectId;

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
}
