import { IsDateString, IsInt, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class UpdateMeetingDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  title!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsInt()
  @Min(15)
  @Max(180)
  durationInMinutes!: number;
}