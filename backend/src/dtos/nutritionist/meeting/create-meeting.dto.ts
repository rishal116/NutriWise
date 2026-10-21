import {
  IsDateString,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import {
  MAX_MEETING_DURATION,
  MIN_MEETING_DURATION,
} from "../../../models/meeting.model";

export class CreateMeetingDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title!: string;

  @IsMongoId()
  userId!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsInt()
  @Min(MIN_MEETING_DURATION)
  @Max(MAX_MEETING_DURATION)
  durationInMinutes!: number;
}
