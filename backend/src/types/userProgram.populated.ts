import { IUser } from "../models/user.model";
import { IUserPlan } from "../models/userPlan.model";
import { INutritionistPlan } from "../models/nutritionistPlan.model";
import { IUserProgram } from "../models/userProgram.model";

export interface IUserProgramPopulated extends Omit<
  IUserProgram,
  "userId" | "nutritionistId" | "userPlanId" | "planId"
> {
  userId: IUser;
  nutritionistId: IUser;
  userPlanId: IUserPlan;
  planId: INutritionistPlan;
}
