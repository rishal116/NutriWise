import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

import { MealType, MEAL_TYPES } from "../../../models/userProgramDay.model";

export class MealDTO {
  @IsEnum(MEAL_TYPES)
  mealType!: MealType;

  @IsString()
  @MaxLength(150)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  order!: number;
}

export class WorkoutDTO {
  @IsString()
  @MaxLength(150)
  title!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  duration!: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  instructions?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  order!: number;
}

export class HabitDTO {
  @IsString()
  @MaxLength(150)
  title!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  targetValue?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealDTO)
  meals?: MealDTO[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutDTO)
  workouts?: WorkoutDTO[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HabitDTO)
  habits?: HabitDTO[];
}

export class UpdateProgramDayDTO {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealDTO)
  meals?: MealDTO[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutDTO)
  workouts?: WorkoutDTO[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HabitDTO)
  habits?: HabitDTO[];
}
