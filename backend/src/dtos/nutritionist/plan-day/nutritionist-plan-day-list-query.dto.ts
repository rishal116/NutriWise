import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MaxLength,
} from "class-validator";

export enum NutritionistPlanDaySort {
  DAY_ASC = "day_asc",
  DAY_DESC = "day_desc",
  NEWEST = "newest",
  OLDEST = "oldest",
}

export class NutritionistPlanDayListQueryDTO {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 12;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  dayNumber?: number;

  @IsOptional()
  @IsEnum(NutritionistPlanDaySort)
  sort: NutritionistPlanDaySort = NutritionistPlanDaySort.DAY_ASC;

  @IsOptional()
  @IsString()
  cursor?: string;
}
