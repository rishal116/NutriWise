import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min, IsString } from "class-validator";

export class AdminPostQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;

  @IsOptional()
  @IsString()
  cursor?: string;
}