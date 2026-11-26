
import { Type } from "class-transformer";
import {
  ArrayUnique,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from "class-validator";

import { SubscriptionPlanBillingDTO } from "./subscription-plan-billing.dto";
import { SubscriptionPlanFeatureDTO } from "./subscription-plan-feature.dto";

export class UpdateSubscriptionPlanDTO {
  @ValidateIf((_object, value) => value !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsDefined()
  @ValidateNested()
  @Type(() => SubscriptionPlanBillingDTO)
  billing?: SubscriptionPlanBillingDTO;

  @ValidateIf((_object, value) => value !== undefined)
  @IsDefined()
  @IsArray()
  @ArrayUnique((feature: SubscriptionPlanFeatureDTO) => feature.key)
  @ValidateNested({ each: true })
  @Type(() => SubscriptionPlanFeatureDTO)
  features?: SubscriptionPlanFeatureDTO[];
}
