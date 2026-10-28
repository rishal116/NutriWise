import { Transform, Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

import {
  SESSION_STATUSES,
  SESSION_TYPES,
} from "../../../models/session.model";

import {
  SESSION_REGISTRATION_PAYMENT_STATUSES,
  SESSION_REGISTRATION_STATUSES,
} from "../../../models/sessionRegistration.model";

import { USER_SESSION_SORT_OPTIONS } from "../../../types/user/session/user-session.types";

export class UserSessionListQueryDTO {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsEnum(
    Object.fromEntries(
      SESSION_REGISTRATION_STATUSES.map((value) => [value, value]),
    ),
  )
  registrationStatus?: (typeof SESSION_REGISTRATION_STATUSES)[number];

  @IsOptional()
  @IsEnum(
    Object.fromEntries(
      SESSION_REGISTRATION_PAYMENT_STATUSES.map((value) => [
        value,
        value,
      ]),
    ),
  )
  paymentStatus?: (typeof SESSION_REGISTRATION_PAYMENT_STATUSES)[number];

  @IsOptional()
  @IsEnum(
    Object.fromEntries(SESSION_TYPES.map((value) => [value, value])),
  )
  sessionType?: (typeof SESSION_TYPES)[number];

  @IsOptional()
  @IsEnum(
    Object.fromEntries(SESSION_STATUSES.map((value) => [value, value])),
  )
  sessionStatus?: (typeof SESSION_STATUSES)[number];

  @IsOptional()
  @IsEnum(
    Object.fromEntries(
      USER_SESSION_SORT_OPTIONS.map((value) => [value, value]),
    ),
  )
  sortBy?: (typeof USER_SESSION_SORT_OPTIONS)[number];

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;
}