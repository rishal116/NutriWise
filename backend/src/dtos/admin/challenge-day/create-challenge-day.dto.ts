import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from "class-validator";

export class CreateChallengeDayDTO {
  @IsInt()
  @Min(1)
  dayNumber!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description!: string;

  activities!: unknown;

  activityMediaIndexes?: unknown;
}
