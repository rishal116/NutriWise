import { IUserPlanPopulated } from "../../types/userPlan.populated";
import { NutritionistSubscriberDTO } from "../../dtos/nutritionist/nutritionistSubscription.dto";

export class NutritionistSubscriptionMapper {
  static toDTO(plan: IUserPlanPopulated): NutritionistSubscriberDTO {
    return {
      id: plan._id.toString(),

      user: {
        id: plan.userId._id.toString(),
        name: plan.userId.fullName,
        email: plan.userId.email,
      },

      plan: {
        id: plan.planId._id.toString(),
        title: plan.planId.title,
        price: plan.planId.price,
        durationInDays: plan.planId.durationInDays,
      },

      status: plan.status,
      startDate: plan.startDate,
      endDate: plan.endDate,
    };
  }

  static toDTOList(plans: IUserPlanPopulated[]) {
    return plans.map(this.toDTO);
  }
}
