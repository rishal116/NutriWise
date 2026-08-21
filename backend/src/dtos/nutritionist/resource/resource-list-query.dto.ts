import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

import {
  RESOURCE_STATUSES,
  RESOURCE_TYPES,
  ResourceStatus,
  ResourceType,
} from "../../../models/resource.model";

export enum NutriResourceSortBy {
  LATEST = "latest",
  OLDEST = "oldest",
  TITLE_ASC = "title_asc",
  TITLE_DESC = "title_desc",
  MOST_VIEWED = "most_viewed",
  MOST_DOWNLOADED = "most_downloaded",
}

export class GetNutriResourcesQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(RESOURCE_STATUSES)
  status?: ResourceStatus;

  @IsOptional()
  @IsEnum(RESOURCE_TYPES)
  type?: ResourceType;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(NutriResourceSortBy)
  sortBy?: NutriResourceSortBy;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
