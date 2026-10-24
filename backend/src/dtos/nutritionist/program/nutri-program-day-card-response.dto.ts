import type { Types } from "mongoose";

export interface INutriProgramDayCardResponseDTO {
  userProgramDayId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  dayNumber: number;
  activityCount: number;
}