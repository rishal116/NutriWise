import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";

import { Type } from "class-transformer";

import {
  PLAN_STATUS,
  PlanStatus,
} from "../../../models/nutritionistPlan.model";

import { CURRENCIES, Currency } from "../../../constants/currency.constants";

import {
  SPECIALIZATIONS,
  Specialization,
} from "../../../types/nutritionist.types";

export class UpdatePlanDTO {
  @IsOptional()
  @IsString()
  @Length(5, 120)
  title?: string;

  @IsOptional()
  @IsEnum(SPECIALIZATIONS)
  specialization?: Specialization;

  @IsOptional()
  @IsString()
  @Length(10, 5000)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(365)
  durationDays?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsEnum(CURRENCIES)
  currency?: Currency;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsEnum(PLAN_STATUS)
  status?: PlanStatus;
}
