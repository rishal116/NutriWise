import { Type } from "class-transformer";
import {
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class GetProgramDaysDTO {
  @IsMongoId()
  clientId!: string;

  @IsMongoId()
  userProgramId!: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;
}