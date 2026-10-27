import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export const POST_SORT_OPTIONS = [
  "latest",
  "oldest",
  "most_liked",
  "most_commented",
  "most_viewed",
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
  @IsIn(POST_SORT_OPTIONS)
  sortBy?: PostSortOption = "latest";

  @IsOptional()
  @IsString()
  cursor?: string;
}
