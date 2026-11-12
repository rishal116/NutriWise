import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from "class-validator";

import {
  SPECIALIZATIONS,
  type Specialization,
} from "../../../constants/nutritionist/profile/specialization.constants";

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
  @IsInt()
  @Min(1)
  @Max(365)
  durationDays?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(150, { each: true })
  features?: string[];
}
