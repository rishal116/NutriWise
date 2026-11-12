import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

import {
  PROGRAM_ACTIVITY_CATEGORIES,
  type ProgramActivityCategory,
} from "../../../constants/user/program/program-activity-category.constants";

import {
  ACTIVITY_VALUE_TYPES,
  type ActivityValueType,
} from "../../../constants/user/program/activity-value-type.constants";

export class NutritionistPlanActivityDTO {
  @IsEnum(PROGRAM_ACTIVITY_CATEGORIES)
  category!: ProgramActivityCategory;

  @IsString()
  @MaxLength(150)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  instructions?: string;

  @IsEnum(ACTIVITY_VALUE_TYPES)
  valueType!: ActivityValueType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  targetValue?: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  unit?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  estimatedDurationMinutes?: number;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  scheduledTime?: string;

  @IsOptional()
  @IsBoolean()
  isRequired: boolean = true;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  order!: number;
}

export class CreateNutritionistPlanDayDTO {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  dayNumber!: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => NutritionistPlanActivityDTO)
  activities!: NutritionistPlanActivityDTO[];
}

export class UpdateNutritionistPlanDayDTO {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => NutritionistPlanActivityDTO)
  activities?: NutritionistPlanActivityDTO[];
}
