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

import { SESSION_STATUSES } from "../../../constants/common/session.constants";
import { SESSION_REGISTRATION_STATUSES } from "../../../constants/common/session-registration.constants";

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
  @IsIn(SESSION_REGISTRATION_STATUSES)
  registrationStatus?: (typeof SESSION_REGISTRATION_STATUSES)[number];

  @IsOptional()
  @IsIn(SESSION_STATUSES)
  sessionStatus?: (typeof SESSION_STATUSES)[number];

  @IsOptional()
  @IsIn(USER_SESSION_SORT_OPTIONS)
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
