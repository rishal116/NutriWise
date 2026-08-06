import { IUserPlan } from "../models/userPlan.model";
import { INutritionistPlan } from "../models/nutritionistPlan.model";
import { IUser } from "../models/user.model";

export interface IUserPlanPopulated extends Omit<
  IUserPlan,
  "planId" | "nutritionistId" | "userId"
> {
  planId: INutritionistPlan;
  nutritionistId: IUser;
  userId: IUser;
}
