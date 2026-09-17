import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

import type {
  ConversationStatus,
  ConversationVisibility,
} from "../../../models/conversation.model";

export enum NutritionistGroupSortBy {
  NEWEST = "newest",
  OLDEST = "oldest",
  TITLE_ASC = "title_asc",
  TITLE_DESC = "title_desc",
}

export class NutritionistGroupListQueryDTO {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @IsOptional()
  @IsString()
  @Max(100)
  search?: string;

  @IsOptional()
  @IsEnum(["active", "inactive", "blocked", "closed"])
  status?: ConversationStatus;

  @IsOptional()
  @IsEnum(["public", "private"])
  visibility?: ConversationVisibility;

  @IsOptional()
  @IsEnum(NutritionistGroupSortBy)
  sortBy?: NutritionistGroupSortBy;
}
