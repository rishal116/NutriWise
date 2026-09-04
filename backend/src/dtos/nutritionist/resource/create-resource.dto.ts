import { IsEnum, IsString, MaxLength, ValidateIf } from "class-validator";

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

  @IsEnum(RESOURCE_CATEGORIES)
  category!: ResourceCategory;
}
