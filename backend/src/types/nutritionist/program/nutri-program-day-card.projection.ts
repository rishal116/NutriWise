import { Types } from "mongoose";

export interface INutriProgramDayCardProjection {
  userProgramDayId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  dayNumber: number;
  activityCount: number;
}