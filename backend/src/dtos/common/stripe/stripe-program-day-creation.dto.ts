import type { ClientSession, Types } from "mongoose";

export interface StripeProgramDayCreationDTO {
  planId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  session: ClientSession;
}