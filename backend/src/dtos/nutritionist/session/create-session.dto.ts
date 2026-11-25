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

class SessionPricingDTO {
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @Max(CREATE_SESSION_LIMITS.priceMax)
  amount!: number;

  @Equals(CURRENCY)
  currency!: Currency;
}

export class CreateNutriSessionDTO {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Length(CREATE_SESSION_LIMITS.titleMin, CREATE_SESSION_LIMITS.titleMax)
  title!: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Length(
    CREATE_SESSION_LIMITS.descriptionMin,
    CREATE_SESSION_LIMITS.descriptionMax,
  )
  description!: string;

  @IsEnum(SESSION_TYPES)
  type!: SessionType;

  @IsEnum(SESSION_PRICING_TYPES)
  pricingType!: SessionPricingType;

  @IsOptional()
  @ValidateNested()
  @Type(() => SessionPricingDTO)
  pricing?: SessionPricingDTO;

  @Type(() => Date)
  @IsDate({ message: "Enter a valid date and time." })
  scheduledAt!: Date;

  @Type(() => Number)
  @IsInt({ message: "Duration must be a whole number." })
  @Min(CREATE_SESSION_LIMITS.durationMin)
  @Max(CREATE_SESSION_LIMITS.durationMax)
  duration!: number;

  @Type(() => Number)
  @IsInt({ message: "Participant capacity must be a whole number." })
  @Min(CREATE_SESSION_LIMITS.participantsMin)
  @Max(CREATE_SESSION_LIMITS.participantsMax)
  maxParticipants!: number;
}
