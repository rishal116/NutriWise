import type {
  BillingInterval,
  SubscriptionAudience,
  SubscriptionPlanStatus,
} from "../../../constants/common/subscription.constants";
import type { Currency } from "../../../constants/common/currency.constants";

export interface AdminSubscriptionPlanListItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  audience: SubscriptionAudience;
  billing: {
    amount: number;
    currency: Currency;
    interval: BillingInterval;
  };
  featureCount: number;
  status: SubscriptionPlanStatus;
}
