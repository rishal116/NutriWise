import { Transform, Type } from "class-transformer";
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

import {
  SessionRegistrationPaymentStatus,
  SessionRegistrationStatus,
} from "../../../models/sessionRegistration.model";
import {
  SESSION_REGISTRATION_PAYMENT_STATUSES,
  SESSION_REGISTRATION_STATUSES,
} from "../../../models/sessionRegistration.model";

import { IsIn } from "class-validator";

export class NutriSessionParticipantsQueryDTO {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  search?: string;

  @IsOptional()
  @IsIn(SESSION_REGISTRATION_STATUSES)
  status?: SessionRegistrationStatus;

  @IsOptional()
  @IsIn(SESSION_REGISTRATION_PAYMENT_STATUSES)
  paymentStatus?: SessionRegistrationPaymentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;
}
