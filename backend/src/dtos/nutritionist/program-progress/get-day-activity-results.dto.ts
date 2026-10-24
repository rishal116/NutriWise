import { Type } from "class-transformer";
import { IsInt, IsMongoId, Min } from "class-validator";

export class GetDayActivityResultsDTO {
  @IsMongoId()
  clientId!: string;

  @IsMongoId()
  userProgramId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  dayNumber!: number;
}