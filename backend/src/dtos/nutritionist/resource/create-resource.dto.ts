import {
  IsBoolean,
  IsEnum,
  IsString,
  IsUrl,
  MaxLength,
  ValidateIf,
} from "class-validator";

import { Transform } from "class-transformer";

import {
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
  ResourceCategory,
  ResourceType,
} from "../../../models/resource.model";

export class CreateNutriResourceDTO {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  @MaxLength(1000)
  description!: string;

  @IsEnum(RESOURCE_TYPES)
  type!: ResourceType;

  @ValidateIf((object: CreateNutriResourceDTO) => object.type === "article")
  @IsString()
  @MaxLength(50000)
  content?: string;

  @ValidateIf(
    (object: CreateNutriResourceDTO) => object.type === "external_link",
  )
  @IsUrl()
  externalUrl?: string;

  @IsEnum(RESOURCE_CATEGORIES)
  category!: ResourceCategory;

  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  isDownloadable!: boolean;
}
