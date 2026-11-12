import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MaxLength,
} from "class-validator";
import {
  SPECIALIZATIONS,
  type Specialization,
} from "../../../constants/nutritionist/profile/specialization.constants";
import {
  PLAN_SORT,
  type PlanSort,
} from "../../../constants/nutritionist/plan/plan-sort.constants";

export class GetPlansDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @IsOptional()
  @IsEnum(SPECIALIZATIONS)
  specialization?: Specialization;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(PLAN_SORT)
  sort: PlanSort = "newest";
}
