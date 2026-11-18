import { Types } from "mongoose";

export interface INutriProgramDayCardProjection {
  userProgramDayId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  dayNumber: number;
  totalActivityCount: number;
  totalRequiredActivityCount: number;
}
