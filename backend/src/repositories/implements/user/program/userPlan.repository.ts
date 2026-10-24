import { FilterQuery, Types } from "mongoose";

import { BaseRepository } from "../../common/base.repository";
import { IUserPlan, UserPlanModel } from "../../../../models/userPlan.model";
import { IUserPlanRepository } from "../../../interfaces/user/program/IUserPlanRepository";
import { IUserPlanPopulated } from "../../../../types/userPlan.populated";
import { INutritionistPlan } from "../../../../models/nutritionistPlan.model";
import { IUser } from "../../../../models/user.model";

export class UserPlanRepository
  extends BaseRepository<IUserPlan>
  implements IUserPlanRepository
{
  constructor() {
    super(UserPlanModel);
  }

  async findByUserId(
    userId: string | Types.ObjectId,
  ): Promise<IUserPlanPopulated[]> {
    return this._model
      .find({ userId })
      .populate<{
        userId: IUser;
        nutritionistId: IUser;
        planId: INutritionistPlan;
      }>(["userId", "nutritionistId", "planId"])
      .sort({ createdAt: -1 })
      .lean<IUserPlanPopulated[]>()
      .exec();
  }

  async findByNutritionistId(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserPlanPopulated[]> {
    return this._model
      .find({ nutritionistId })
      .populate<{
        userId: IUser;
        nutritionistId: IUser;
        planId: INutritionistPlan;
      }>(["userId", "nutritionistId", "planId"])
      .sort({ createdAt: -1 })
      .lean<IUserPlanPopulated[]>()
      .exec();
  }

  async findOnePopulated(
    filter: FilterQuery<IUserPlan>,
  ): Promise<IUserPlanPopulated | null> {
    return this._model
      .findOne(filter)
      .populate<{
        userId: IUser;
        nutritionistId: IUser;
        planId: INutritionistPlan;
      }>(["userId", "nutritionistId", "planId"])
      .lean<IUserPlanPopulated | null>()
      .exec();
  }
}
