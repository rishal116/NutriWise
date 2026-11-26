import type {
  BillingInterval,
  SubscriptionAudience,
  SubscriptionPlanStatus,
} from "@/constants/common/subscription.constants";
import type { Currency } from "@/constants/common/currency.constants";

export interface AdminSubscriptionPlanDetailsFeatureDTO {
  key: string;
  enabled: boolean;
}

export interface AdminSubscriptionPlanDetailsDTO {
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
  features: AdminSubscriptionPlanDetailsFeatureDTO[];
  providerReferences: {
    stripePriceId: string | null;
  };
  status: SubscriptionPlanStatus;
  createdAt: string;
  updatedAt: string;
}