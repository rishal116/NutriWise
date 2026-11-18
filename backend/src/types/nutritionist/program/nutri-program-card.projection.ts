import { Types } from "mongoose";

import type { ProgramStatus } from "../../../constants/user/program/program-status.constants";

export interface INutriProgramCardProjection {
  userProgramId: Types.ObjectId;

  userId: Types.ObjectId;
  userFullName: string;
  userProfileImage?: string;

  planTitle: string;
  specialization: string;

  programStatus: ProgramStatus;
  currentDay: number;
  durationDays: number;

  completionPercentage: number;

  startDate: Date | null;
  endDate: Date | null;
}

export interface IProgramCardWithCursor extends INutriProgramCardProjection {
  cursorId: Types.ObjectId;
  cursorValue: string | number | Date;
}
