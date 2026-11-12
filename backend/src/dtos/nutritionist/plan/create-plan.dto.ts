import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
  ArrayMaxSize,
  MaxLength,
} from "class-validator";

import {
  SPECIALIZATIONS,
  type Specialization,
} from "../../../constants/nutritionist/profile/specialization.constants";

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
  @IsInt()
  @Min(1)
  @Max(365)
  durationDays!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(150, { each: true })
  features!: string[];
}
