import type { ClientSession, Types } from "mongoose";
import type { INutritionistPlan } from "../../../../models/nutritionistPlan.model";

export interface IStripeProgramProvisioningService {
  provision(data: {
    userId: Types.ObjectId;
    nutritionistId: Types.ObjectId;
    planId: Types.ObjectId;
    plan: INutritionistPlan;
    amount: number;
    session: ClientSession;
  }): Promise<{
    userPlanId: Types.ObjectId;
    userProgramId: Types.ObjectId;
  }>;
}
