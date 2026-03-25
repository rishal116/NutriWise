import { IUserPlanPopulated } from "../../types/userPlan.populated";
import { NutritionistSubscriberDTO } from "../../dtos/nutritionist/nutritionistSubscriber.dto";
import { NutritionistSubscriptionDTO } from "../../dtos/nutritionist/nutritionistSubscription.dto";

export class NutritionistSubscriptionMapper {
  static toSubscriberDTO(plan: IUserPlanPopulated): NutritionistSubscriberDTO {
    return {
        id: plan.userId._id.toString(),
        name: plan.userId.fullName,
        email: plan.userId.email,
    };
  }

  static toSubscriberDTOList(plans: IUserPlanPopulated[]): NutritionistSubscriberDTO[] {
    return plans.map(this.toSubscriberDTO);
  }

  // Existing subscription mapping
  static toSubscriptionDTO(plan: IUserPlanPopulated): NutritionistSubscriptionDTO {
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

  static toSubscriptionDTOList(plans: IUserPlanPopulated[]): NutritionistSubscriptionDTO[] {
    return plans.map(this.toSubscriptionDTO);
  }
}

