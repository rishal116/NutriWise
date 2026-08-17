import { Types } from "mongoose";

export interface ProgramDayCardResponseDTO {
  userProgramDayId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  dayNumber: number;
  activityCount: number;
}
