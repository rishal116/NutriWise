import { UserPlanResponseDTO } from "../../../dtos/user/userPlan.dto";
import { NutritionistSubscriberDTO } from "../../../dtos/nutritionist/nutritionistSubscription.dto";

export interface IUserPlanService {
  getMyPlans(userId: string): Promise<UserPlanResponseDTO[]>;

  getSubscribers(
    nutritionistId: string
  ): Promise<NutritionistSubscriberDTO[]>;

  getPlanById(
    planId: string,
    userId: string
  ): Promise<UserPlanResponseDTO>;
}
