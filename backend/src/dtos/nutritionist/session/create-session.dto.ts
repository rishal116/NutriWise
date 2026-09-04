import {
  SESSION_PRICING_TYPES,
  SESSION_TYPES,
  SessionPricingType,
  SessionType,
} from "../../../models/session.model";
import { CURRENCIES, Currency } from "../../../constants/currency.constants";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class SessionPricingDTO {
  @IsEnum(SESSION_PRICING_TYPES)
  type!: SessionPricingType;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount!: number;

  @IsEnum(CURRENCIES)
  currency!: Currency;
}

export class CreateNutriSessionDTO {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(SESSION_TYPES)
  type!: SessionType;

  @ValidateNested()
  @Type(() => SessionPricingDTO)
  pricing!: SessionPricingDTO;

  @Type(() => Date)
  scheduledAt!: Date;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationInMinutes!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxParticipants!: number;
}
