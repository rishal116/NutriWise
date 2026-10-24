import { Type } from "class-transformer";
import {
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
  ACTIVITY_VALUE_TYPES,
} from "../../../models/userProgramDay.model";
import type {
  ProgramActivityCategory,
  ActivityValueType,
} from "../../../models/userProgramDay.model";

export class NutriProgramActivityDTO {
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
  @IsNumber()
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

export class CreateProgramDayDTO {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  dayNumber!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NutriProgramActivityDTO)
  activities!: NutriProgramActivityDTO[];
}

export class UpdateProgramDayDTO {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NutriProgramActivityDTO)
  activities?: NutriProgramActivityDTO[];
}
