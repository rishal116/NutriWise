import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export const POST_SORT_OPTIONS = [
  "latest",
  "oldest",
  "most_liked",
  "most_commented",
  "most_bookmarked",
] as const;

export type PostSortOption = (typeof POST_SORT_OPTIONS)[number];

export class PostListQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 12;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(POST_SORT_OPTIONS)
  sortBy?: PostSortOption;

  @IsOptional()
  @IsString()
  cursor?: string;
}
