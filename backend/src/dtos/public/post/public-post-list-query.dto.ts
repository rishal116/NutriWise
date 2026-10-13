import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

import { PostMediaType } from "../../../types/common/post-media.type";

export class PublicPostListQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 12;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsEnum(PostMediaType)
  mediaType?: PostMediaType;

  @IsOptional()
  @IsMongoId()
  authorId?: string;

  @IsOptional()
  @IsEnum(["latest", "oldest"])
  sortBy: "latest" | "oldest" = "latest";
}
