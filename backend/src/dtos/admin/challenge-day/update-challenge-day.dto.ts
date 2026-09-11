import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateChallengeDayDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description?: string;

  activities?: unknown;

  activityMediaIndexes?: unknown;
}
