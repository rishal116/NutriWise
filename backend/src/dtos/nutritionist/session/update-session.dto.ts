import { Transform, Type } from "class-transformer";
import {
  Equals,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

import {
  SESSION_PRICING_TYPES,
  SESSION_TYPES,
  type SessionPricingType,
  type SessionType,
} from "../../../constants/common/session.constants";

import {
  CURRENCY,
  type Currency,
} from "../../../constants/common/currency.constants";

import { CREATE_SESSION_LIMITS } from "../../../constants/nutritionist/session/session.constant";

class UpdateSessionPricingDTO {
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @Max(CREATE_SESSION_LIMITS.priceMax)
  amount!: number;

  @Equals(CURRENCY)
  currency!: Currency;
}

export class UpdateNutriSessionDTO {
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Length(CREATE_SESSION_LIMITS.titleMin, CREATE_SESSION_LIMITS.titleMax)
  title?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Length(
    CREATE_SESSION_LIMITS.descriptionMin,
    CREATE_SESSION_LIMITS.descriptionMax,
  )
  description?: string;

  @IsOptional()
  @IsEnum(SESSION_TYPES)
  type?: SessionType;

  @IsOptional()
  @IsEnum(SESSION_PRICING_TYPES)
  pricingType?: SessionPricingType;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSessionPricingDTO)
  pricing?: UpdateSessionPricingDTO;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: "Enter a valid date and time." })
  scheduledAt?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(CREATE_SESSION_LIMITS.durationMin)
  @Max(CREATE_SESSION_LIMITS.durationMax)
  duration?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(CREATE_SESSION_LIMITS.participantsMin)
  @Max(CREATE_SESSION_LIMITS.participantsMax)
  maxParticipants?: number;
}
