import type { BillingInterval } from "@/constants/common/subscription.constants";
import type { SubscriptionPlanFeatureDTO } from "./subscription-plan-feature.dto";

export interface UpdateSubscriptionPlanDTO {
  name?: string;
  description?: string;
  billing?: {
    amount: number;
    interval: BillingInterval;
  };
  features?: SubscriptionPlanFeatureDTO[];
}
