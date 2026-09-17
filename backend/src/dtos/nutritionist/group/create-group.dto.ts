import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

import type { ConversationVisibility } from "../../../models/conversation.model";

export class CreateGroupDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  groupAvatar?: string;

  @IsEnum(["public", "private"])
  visibility!: ConversationVisibility;
}