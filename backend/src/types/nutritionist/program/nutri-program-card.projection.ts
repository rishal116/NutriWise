import { Types } from "mongoose";
import { ProgramStatus } from "../../../models/userProgram.model";

export interface INutriProgramCardProjection {
  userProgramId: Types.ObjectId;

  userId: Types.ObjectId;
  userFullName: string;
  userProfileImage?: string;

  planTitle: string;
  specialization: string;

  programStatus: ProgramStatus;
  startDate: Date;
  endDate: Date;
  durationDays: number;

  completionPercentage: number;
}
