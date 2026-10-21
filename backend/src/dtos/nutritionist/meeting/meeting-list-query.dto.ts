import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { MeetingStatus } from "../../../models/meeting.model";

export enum MeetingSortBy {
  SCHEDULED_AT = "scheduledAt",
  CREATED_AT = "createdAt",
  TITLE = "title",
}

export enum MeetingSortOrder {
  ASC = "asc",
  DESC = "desc",
}

export class MeetingListQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 12;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(MeetingStatus)
  status?: MeetingStatus;

  @IsOptional()
  @IsEnum(MeetingSortBy)
  sortBy: MeetingSortBy = MeetingSortBy.SCHEDULED_AT;

  @IsOptional()
  @IsEnum(MeetingSortOrder)
  sortOrder: MeetingSortOrder = MeetingSortOrder.ASC;
}
