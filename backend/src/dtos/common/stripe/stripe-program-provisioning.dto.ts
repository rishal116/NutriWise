import type { ClientSession, Types } from "mongoose";
import type { INutritionistPlan } from "../../../models/nutritionistPlan.model";

export interface ProvisionUserProgramDTO {
  userId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  planId: Types.ObjectId;
  plan: INutritionistPlan;
  amount: number;
  session: ClientSession;
}

export interface ProvisionedUserProgramDTO {
  userPlanId: Types.ObjectId;
  userProgramId: Types.ObjectId;
}
