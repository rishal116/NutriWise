import {
  IsDefined,
  IsIn,
  IsInt,
  Min,
} from "class-validator";

import {
  BILLING_INTERVALS,
  type BillingInterval,
} from "../../../constants/common/subscription.constants";

export class SubscriptionPlanBillingDTO {
  @IsDefined()
  @IsInt()
  @Min(50)
  amount!: number;

  @IsDefined()
  @IsIn(BILLING_INTERVALS)
  interval!: BillingInterval;
}