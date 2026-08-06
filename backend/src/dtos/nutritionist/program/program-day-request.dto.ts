import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

import {
  PROGRAM_ACTIVITY_CATEGORIES,
  ACTIVITY_VALUE_TYPES,
  ProgramActivityCategory,
  ActivityValueType,
} from "../../../models/userProgramDay.model";


export class ProgramActivityDTO {

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
  @IsBoolean()
  isRequired?: boolean = true;


  @IsOptional()
  @IsObject()
  configuration?: Record<string, unknown>;


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
  @Type(() => ProgramActivityDTO)
  activities!: ProgramActivityDTO[];
}



export class UpdateProgramDayDTO {


  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProgramActivityDTO)
  activities?: ProgramActivityDTO[];
}