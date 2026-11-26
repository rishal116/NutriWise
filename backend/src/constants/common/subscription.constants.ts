export const SUBSCRIPTION_AUDIENCES = ["user", "nutritionist"] as const;

export type SubscriptionAudience = (typeof SUBSCRIPTION_AUDIENCES)[number];

export const SUBSCRIPTION_PLAN_STATUSES = [
  "draft",
  "published",
  "archived",
] as const;

export type SubscriptionPlanStatus =
  (typeof SUBSCRIPTION_PLAN_STATUSES)[number];

export const BILLING_INTERVALS = ["monthly", "yearly"] as const;

export type BillingInterval = (typeof BILLING_INTERVALS)[number];

export const FEATURE_USAGE_PERIODS = [
  "day",
  "week",
  "month",
  "billing_cycle",
  "lifetime",
] as const;

export type FeatureUsagePeriod = (typeof FEATURE_USAGE_PERIODS)[number];

export const USER_SUBSCRIPTION_STATUSES = [
  "pending",
  "active",
  "past_due",
  "cancelled",
  "expired",
] as const;

export type UserSubscriptionStatus =
  (typeof USER_SUBSCRIPTION_STATUSES)[number];
