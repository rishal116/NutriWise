import { Type, Transform } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
  Validate,
  ValidateNested,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Equals,
  registerDecorator,
  ValidationOptions,
} from "class-validator";

import {
  SESSION_PRICING_TYPES,
  SESSION_TYPES,
  SessionPricingType,
  SessionType,
} from "../../../models/session.model";
import { CURRENCY, Currency } from "../../../constants/currency.constants";
import { CREATE_SESSION_LIMITS } from "../../../constants/nutritionist/session/session.constant";

@ValidatorConstraint({ name: "isFutureDate", async: false })
class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: Date): boolean {
    return (
      value instanceof Date &&
      Number.isFinite(value.getTime()) &&
      value.getTime() > Date.now()
    );
  }

  defaultMessage(): string {
    return "Choose a date and time in the future.";
  }
}

function IsValidSessionPrice(
  pricingTypeProperty: string,
  options?: ValidationOptions,
): PropertyDecorator {
  return (target, propertyKey) => {
    registerDecorator({
      name: "isValidSessionPrice",
      target: target.constructor,
      propertyName: propertyKey.toString(),
      constraints: [pricingTypeProperty],
      options,
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const [relatedPropertyName] = args.constraints as [string];
          const pricingType = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];

          if (typeof value !== "number" || !Number.isFinite(value)) {
            return false;
          }

          if (pricingType === "free") {
            return value === 0;
          }

          if (pricingType === "paid") {
            return (
              value >= CREATE_SESSION_LIMITS.priceMin &&
              value <= CREATE_SESSION_LIMITS.priceMax
            );
          }

          return false;
        },

        defaultMessage(args: ValidationArguments): string {
          const [relatedPropertyName] = args.constraints as [string];
          const pricingType = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];

          if (pricingType === "free") {
            return "Free sessions must have a price of ₹0.";
          }

          if (pricingType === "paid") {
            const value = args.value as number;

            if (value < CREATE_SESSION_LIMITS.priceMin) {
              return `Price must be at least ₹${CREATE_SESSION_LIMITS.priceMin}.`;
            }

            return `Price cannot exceed ₹${CREATE_SESSION_LIMITS.priceMax.toLocaleString("en-IN")}.`;
          }

          return "Enter a valid price.";
        },
      },
    });
  };
}

class SessionPricingDTO {
  @IsEnum(SESSION_PRICING_TYPES)
  type!: SessionPricingType;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsValidSessionPrice("type")
  amount!: number;

  @Equals(CURRENCY)
  currency!: Currency;
}

export class CreateNutriSessionDTO {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Length(CREATE_SESSION_LIMITS.titleMin, CREATE_SESSION_LIMITS.titleMax, {
    message: `Title must contain ${CREATE_SESSION_LIMITS.titleMin} to ${CREATE_SESSION_LIMITS.titleMax} characters.`,
  })
  title!: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Length(
    CREATE_SESSION_LIMITS.descriptionMin,
    CREATE_SESSION_LIMITS.descriptionMax,
    {
      message: `Description must contain ${CREATE_SESSION_LIMITS.descriptionMin} to ${CREATE_SESSION_LIMITS.descriptionMax} characters.`,
    },
  )
  description!: string;

  @IsEnum(SESSION_TYPES)
  type!: SessionType;

  @ValidateNested()
  @Type(() => SessionPricingDTO)
  pricing!: SessionPricingDTO;

  @Transform(({ value }) =>
    typeof value === "string" ? new Date(value) : value,
  )
  @IsDate({ message: "Enter a valid date and time." })
  @Validate(IsFutureDateConstraint)
  scheduledAt!: Date;

  @Type(() => Number)
  @IsInt({ message: "Duration must be a whole number." })
  @Min(CREATE_SESSION_LIMITS.durationMin, {
    message: `Duration must be at least ${CREATE_SESSION_LIMITS.durationMin} minutes.`,
  })
  @Max(CREATE_SESSION_LIMITS.durationMax, {
    message: `Duration cannot exceed ${CREATE_SESSION_LIMITS.durationMax} minutes.`,
  })
  durationInMinutes!: number;

  @Type(() => Number)
  @IsInt({ message: "Participant capacity must be a whole number." })
  @Min(CREATE_SESSION_LIMITS.participantsMin, {
    message: `Allow at least ${CREATE_SESSION_LIMITS.participantsMin} participants.`,
  })
  @Max(CREATE_SESSION_LIMITS.participantsMax, {
    message: `Participant capacity cannot exceed ${CREATE_SESSION_LIMITS.participantsMax}.`,
  })
  maxParticipants!: number;
}
