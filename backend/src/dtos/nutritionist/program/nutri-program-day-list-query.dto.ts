import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export enum ProgramDaySortBy {
  ASC = "asc",
  DESC = "desc",
}

export class ProgramDayListQueryDTO {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;

  @IsOptional()
  @IsEnum(ProgramDaySortBy)
  sortBy: ProgramDaySortBy = ProgramDaySortBy.ASC;
}
