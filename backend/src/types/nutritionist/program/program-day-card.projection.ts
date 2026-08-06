import { Types } from "mongoose";

export interface IProgramDayCardProjection {
  userProgramDayId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  dayNumber: number;
  activityCount: number;
}
