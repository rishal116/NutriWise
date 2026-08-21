import {
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from "class-validator";
import { MeetingType } from "../../../models/meeting.model";

export class CreateMeetingDTO {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsMongoId()
  userId!: string;

  @IsMongoId()
  nutritionistId!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsInt()
  @Min(1)
  @Max(480)
  durationInMinutes!: number;

  @IsEnum(MeetingType)
  type!: MeetingType;
}
