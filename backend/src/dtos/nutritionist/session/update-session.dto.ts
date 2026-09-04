import { Type } from "class-transformer";

import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

import {
  SESSION_PRICING_TYPES,
  SESSION_TYPES,
  SessionPricingType,
  SessionType,
} from "../../../models/session.model";

import { CURRENCIES, Currency } from "../../../constants/currency.constants";

class UpdateSessionPricingDTO {
  @IsEnum(SESSION_PRICING_TYPES)
  type!: SessionPricingType;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount!: number;

  @IsEnum(CURRENCIES)
  currency!: Currency;
}

export class UpdateNutriSessionDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsEnum(SESSION_TYPES)
  type?: SessionType;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSessionPricingDTO)
  pricing?: UpdateSessionPricingDTO;

  @IsOptional()
  @Type(() => Date)
  scheduledAt?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationInMinutes?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxParticipants?: number;
}
