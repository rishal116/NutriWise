import type {
  BillingInterval,
  SubscriptionAudience,
  SubscriptionPlanStatus,
} from "@/constants/common/subscription.constants";

export interface AdminSubscriptionPlanListQueryDTO {
  search?: string;
  audience?: SubscriptionAudience;
  status?: SubscriptionPlanStatus;
  interval?: BillingInterval;
  sortBy?: "newest" | "oldest";
  cursor?: string;
  limit?: number;
}