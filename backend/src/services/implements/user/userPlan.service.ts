import { injectable, inject } from "inversify";
import { IUserPlanService } from "../../interfaces/user/IUserPlanService";
import { IUserPlanRepository } from "../../../repositories/interfaces/user/IUserPlanRepository";
import { TYPES } from "../../../types/types";
import { UserPlanMapper } from "../../../mapper/user/userPlan.mapper";
import { NutritionistSubscriptionMapper } from "../../../mapper/nutritionist/nutritionistSubscription.mapper";
import { Types } from "mongoose";

@injectable()
export class UserPlanService implements IUserPlanService {
  constructor(
    @inject(TYPES.IUserPlanRepository)
    private _userPlanRepo: IUserPlanRepository
  ) {}

  async getMyPlans(userId: string) {
    const plans = await this._userPlanRepo.findByUserId(userId);
    return UserPlanMapper.toUserDTOList(plans);
  }

  async getSubscribers(nutritionistId: string) {
    const plans = await this._userPlanRepo.findByNutritionistId(nutritionistId);
    return NutritionistSubscriptionMapper.toDTOList(plans);
  }
  
  async getPlanById(planId: string, userId: string) {
    const plan = await this._userPlanRepo.findOnePopulated({
      _id: new Types.ObjectId(planId),
      userId: new Types.ObjectId(userId),
    });
    if (!plan) {
      throw new Error("Plan not found");
    }
    return UserPlanMapper.toUserDTO(plan);
  }

}
