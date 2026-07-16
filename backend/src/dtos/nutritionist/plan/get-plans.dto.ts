import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

import {
  SPECIALIZATIONS,
  Specialization,
} from "../../../types/nutritionist.types";

import { PLAN_SORT, PlanSort } from "../../../types/plan.types";

export class GetPlansDTO {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;

  @IsOptional()
  @IsMongoId()
  cursor?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SPECIALIZATIONS)
  specialization?: Specialization;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(PLAN_SORT)
  sort: PlanSort = "newest";
}
