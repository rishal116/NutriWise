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
  PLAN_CURRENCY,
  PLAN_STATUS,
  PlanCurrency,
  PlanStatus,
} from "../../../models/nutritionistPlan.model";

import {
  SPECIALIZATIONS,
  Specialization,
} from "../../../types/nutritionist.types";

export class CreatePlanDTO {
  @IsString()
  @Length(5, 120)
  title!: string;

  @IsEnum(SPECIALIZATIONS)
  specialization!: Specialization;

  @IsString()
  @Length(10, 5000)
  description!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(365)
  durationDays!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsEnum(PLAN_CURRENCY)
  currency?: PlanCurrency = "INR";

  @IsArray()
  @IsString({ each: true })
  features!: string[];

  @IsOptional()
  @IsEnum(PLAN_STATUS)
  status?: PlanStatus = "draft";
}
