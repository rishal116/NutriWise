import type {
  BillingInterval,
} from "@/constants/common/subscription.constants";
import type { Currency } from "@/constants/common/currency.constants";

export interface SubscriptionPlanBillingDTO {
  amount: number;
  currency: Currency;
  interval: BillingInterval;
}