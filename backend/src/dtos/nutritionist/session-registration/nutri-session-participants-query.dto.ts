import { Transform, Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

import {
  SESSION_REGISTRATION_STATUSES,
  type SessionRegistrationStatus,
} from "../../../constants/common/session-registration.constants";

import {
  PAYMENT_STATUSES,
  type PaymentStatus,
} from "../../../constants/common/payment.constants";

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
  @IsIn(PAYMENT_STATUSES)
  paymentStatus?: PaymentStatus;

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
