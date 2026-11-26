import { Transform, Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

import {
  BILLING_INTERVALS,
  SUBSCRIPTION_AUDIENCES,
  SUBSCRIPTION_PLAN_STATUSES,
  type BillingInterval,
  type SubscriptionAudience,
  type SubscriptionPlanStatus,
} from "../../../constants/common/subscription.constants";

export class AdminSubscriptionPlanListQueryDTO {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  search?: string;

  @IsOptional()
  @IsIn(SUBSCRIPTION_AUDIENCES)
  audience?: SubscriptionAudience;

  @IsOptional()
  @IsIn(SUBSCRIPTION_PLAN_STATUSES)
  status?: SubscriptionPlanStatus;

  @IsOptional()
  @IsIn(BILLING_INTERVALS)
  interval?: BillingInterval;

  @IsOptional()
  @IsIn(["newest", "oldest"])
  sortBy?: "newest" | "oldest";

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
