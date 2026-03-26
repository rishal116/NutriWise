import { injectable, inject } from "inversify";
import { IUserPlanRepository } from "../../../repositories/interfaces/user/IUserPlanRepository";
import { TYPES } from "../../../types/types";
import { NutritionistSubscriptionMapper } from "../../../mapper/nutritionist/nutritionistSubscription.mapper";
import { INutriSubscriptionService } from "../../interfaces/nutritionist/INutriSubcriptionService";
import { NutritionistSubscriberDTO } from "../../../dtos/nutritionist/nutritionistSubscriber.dto";
import { NutritionistSubscriptionDTO } from "../../../dtos/nutritionist/nutritionistSubscription.dto";

@injectable()
export class NutriSubscriptionService implements INutriSubscriptionService {
  constructor(
    @inject(TYPES.IUserPlanRepository)
    private readonly _userPlanRepo: IUserPlanRepository,
  ) {}

  async getSubscriptions(
    nutritionistId: string,
  ): Promise<NutritionistSubscriptionDTO[]> {
    const plans = await this._userPlanRepo.findByNutritionistId(nutritionistId);
    return NutritionistSubscriptionMapper.toSubscriptionDTOList(plans);
  }

  async getSubscribers(
    nutritionistId: string,
  ): Promise<NutritionistSubscriberDTO[]> {
    const plans = await this._userPlanRepo.findByNutritionistId(nutritionistId);
    const activePlans = plans.filter((plan) => plan.status === "ACTIVE");
    const subscriberDTOs =
      NutritionistSubscriptionMapper.toSubscriberDTOList(activePlans);
    const uniqueSubscribersMap = new Map<string, NutritionistSubscriberDTO>();

    subscriberDTOs.forEach((sub) => {
      if (!uniqueSubscribersMap.has(sub.id)) {
        uniqueSubscribersMap.set(sub.id, sub);
      }
    });

    return Array.from(uniqueSubscribersMap.values());
  }
}
