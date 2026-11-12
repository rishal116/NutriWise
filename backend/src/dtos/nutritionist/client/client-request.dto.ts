import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export enum ClientStatusFilter {
  ALL = "all",
  UPCOMING = "upcoming",
  ACTIVE = "active",
  PAUSED = "paused",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum ClientSortBy {
  LATEST = "latest",
  NAME_ASC = "name_asc",
  NAME_DESC = "name_desc",
  START_DATE = "start_date",
  END_DATE = "end_date",
}

export class GetClientsQueryDTO {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ClientStatusFilter)
  status: ClientStatusFilter = ClientStatusFilter.ALL;

  @IsOptional()
  @IsEnum(ClientSortBy)
  sortBy: ClientSortBy = ClientSortBy.LATEST;
}

export class GetClientParamsDTO {
  @IsString()
  clientId!: string;
}
