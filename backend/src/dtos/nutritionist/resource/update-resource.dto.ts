import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

import {
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
  ResourceCategory,
  ResourceType,
} from "../../../models/resource.model";

export class UpdateNutriResourceDTO {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(RESOURCE_TYPES)
  type?: ResourceType;

  @IsOptional()
  @IsString()
  @MaxLength(50000)
  content?: string;

  @IsOptional()
  @IsEnum(RESOURCE_CATEGORIES)
  category?: ResourceCategory;
}
