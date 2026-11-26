import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from "class-validator";

export class SubscriptionPlanFeatureDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/)
  key!: string;

  @IsDefined()
  @IsBoolean()
  enabled!: boolean;
}
