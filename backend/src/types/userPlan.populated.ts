import { IUserPlan } from "../models/userPlan.model";
import { IPlan } from "../models/nutritionistPlan.model";
import { IUser } from "../models/user.model";

export interface IUserPlanPopulated
  extends Omit<IUserPlan, "planId" | "nutritionistId" | "userId"> {
  planId: IPlan;
  nutritionistId: IUser;
  userId: IUser;
}
