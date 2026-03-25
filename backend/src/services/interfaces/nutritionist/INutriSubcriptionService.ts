import { NutritionistSubscriberDTO } from "../../../dtos/nutritionist/nutritionistSubscriber.dto";
import { NutritionistSubscriptionDTO } from "../../../dtos/nutritionist/nutritionistSubscription.dto";

export interface INutriSubscriptionService {
  getSubscribers(nutritionistId: string): Promise<NutritionistSubscriberDTO[]>;
  getSubscriptions(nutritionistId: string): Promise<NutritionistSubscriptionDTO[]>;
}