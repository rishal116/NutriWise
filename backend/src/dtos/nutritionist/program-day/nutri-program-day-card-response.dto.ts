import type { Types } from "mongoose";

export interface NutriProgramDayCardResponseDTO {
  userProgramDayId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  dayNumber: number;
  totalActivityCount: number;
  totalRequiredActivityCount: number;
}