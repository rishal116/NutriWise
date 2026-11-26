import { BillingInterval, SubscriptionAudience } from "@/constants/common/subscription.constants";
import { SubscriptionPlanFeatureDTO } from "./subscription-plan-feature.dto";

export interface CreateSubscriptionPlanDTO {
  name: string;
  description: string;
  audience: SubscriptionAudience;
  billing: {
    amount: number;
    interval: BillingInterval;
  };
  features: SubscriptionPlanFeatureDTO[];
}