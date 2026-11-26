import { Type } from "class-transformer";
import {
  ArrayUnique,
  IsArray,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";

import {
  SUBSCRIPTION_AUDIENCES,
  type SubscriptionAudience,
} from "../../../constants/common/subscription.constants";
import { SubscriptionPlanBillingDTO } from "./subscription-plan-billing.dto";
import { SubscriptionPlanFeatureDTO } from "./subscription-plan-feature.dto";

export class CreateSubscriptionPlanDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description!: string;

  @IsDefined()
  @IsString()
  @IsIn(SUBSCRIPTION_AUDIENCES)
  audience!: SubscriptionAudience;

  @IsDefined()
  @ValidateNested()
  @Type(() => SubscriptionPlanBillingDTO)
  billing!: SubscriptionPlanBillingDTO;

  @IsDefined()
  @IsArray()
  @ArrayUnique((feature: SubscriptionPlanFeatureDTO) => feature.key)
  @ValidateNested({ each: true })
  @Type(() => SubscriptionPlanFeatureDTO)
  features!: SubscriptionPlanFeatureDTO[];
}
